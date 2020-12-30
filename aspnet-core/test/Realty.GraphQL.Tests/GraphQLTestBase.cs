using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Conversion;
using GraphQL.Execution;
using GraphQL.Http;
using GraphQL.Types;
using GraphQL.Validation;
using GraphQL.Validation.Complexity;
using GraphQLParser.Exceptions;
using Realty.Test.Base;
using Newtonsoft.Json.Linq;
using Shouldly;

namespace Realty.GraphQL.Tests
{
    public class GraphQLTestBase<TSchema> : GraphQLTestBase<TSchema, GraphQLDocumentBuilder>
        where TSchema : ISchema
    {

    }

    public class GraphQLTestBase<TSchema, TDocumentBuilder> : AppTestBase<RealtyGraphQLTestModule>
        where TSchema : ISchema
        where TDocumentBuilder : IDocumentBuilder, new()
    {
        public TSchema Schema;

        public IDocumentExecuter Executer { get; }

        public IDocumentWriter Writer { get; }

        public GraphQLTestBase()
        {
            Schema = Resolve<TSchema>();

            Executer = new DocumentExecuter(new TDocumentBuilder(), new DocumentValidator(), new ComplexityAnalyzer());

            Writer = new DocumentWriter(indent: true);
        }

        public async Task<ExecutionResult> AssertQuerySuccessAsync(
            string query,
            string expectedResult,
            Inputs inputs = null,
            object root = null,
            object userContext = null,
            CancellationToken cancellationToken = default,
            IEnumerable<IValidationRule> rules = null)
        {
            var queryResult = ParseQueryResult(expectedResult);

            return await AssertQueryAsync(query, queryResult, inputs, root, userContext, cancellationToken, rules);
        }

        public async Task<ExecutionResult> AssertQueryWithErrorsAsync(
            string query,
            string expectedResult,
            Inputs inputs = null,
            object root = null,
            object userContext = null,
            CancellationToken cancellationToken = default,
            int expectedErrorCount = 0,
            bool renderErrors = false)
        {
            var queryResult = ParseQueryResult(expectedResult);

            return await AssertQueryIgnoreErrorsAsync(
                query,
                queryResult,
                inputs,
                root,
                userContext,
                cancellationToken,
                expectedErrorCount,
                renderErrors);
        }

        public async Task<ExecutionResult> AssertQueryIgnoreErrorsAsync(
            string query,
            ExecutionResult expectedExecutionResult,
            Inputs inputs = null,
            object root = null,
            object userContext = null,
            CancellationToken cancellationToken = default,
            int expectedErrorCount = 0,
            bool renderErrors = false)
        {
            var executionResult = await Executer.ExecuteAsync(options =>
            {
                options.Schema = Schema;
                options.Query = query;
                options.Root = root;
                options.Inputs = inputs;
                options.UserContext = userContext;
                options.CancellationToken = cancellationToken;
            });

            var actualResult = await Writer
                .WriteToStringAsync(renderErrors
                    ? executionResult
                    : new ExecutionResult
                    {
                        Data = executionResult.Data
                    });

            var expectedResult = await Writer.WriteToStringAsync(expectedExecutionResult);

            actualResult.ShouldBe(expectedResult);

            if (executionResult.Errors == null)
            {
                executionResult.Errors = new ExecutionErrors();
            }

            executionResult.Errors.Count().ShouldBe(expectedErrorCount);

            return executionResult;
        }

        public async Task<ExecutionResult> AssertQueryAsync(
            string query,
            ExecutionResult expectedExecutionResult,
            Inputs inputs,
            object root,
            object userContext = null,
            CancellationToken cancellationToken = default,
            IEnumerable<IValidationRule> rules = null)
        {
            var executionResult = await Executer.ExecuteAsync(options =>
            {
                options.Schema = Schema;
                options.Query = query;
                options.Root = root;
                options.Inputs = inputs;
                options.UserContext = userContext;
                options.CancellationToken = cancellationToken;
                options.ValidationRules = rules;
                options.FieldNameConverter = new CamelCaseFieldNameConverter();
            });

            var actualResult = await Writer.WriteToStringAsync(executionResult);

            var expectedResult = await Writer.WriteToStringAsync(expectedExecutionResult);

            string additionalInfo = null;

            if (executionResult.Errors?.Any() == true)
            {
                additionalInfo = string.Join(Environment.NewLine, executionResult.Errors
                    .Where(x => x.InnerException is GraphQLSyntaxErrorException)
                    .Select(x => x.InnerException.Message));
            }

            actualResult.ShouldBe(expectedResult, additionalInfo);

            return executionResult;
        }

        public ExecutionResult ParseQueryResult(string result, ExecutionErrors errors = null)
        {
            object data = null;

            if (!string.IsNullOrWhiteSpace(result))
            {
                data = JObject.Parse(result);
            }

            return new ExecutionResult
            {
                Data = data,
                Errors = errors
            };
        }
    }
}