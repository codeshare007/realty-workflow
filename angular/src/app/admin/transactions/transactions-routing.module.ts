import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManageTransactionComponent } from './manage-transaction/manage-transaction.component';
import { TransactionFormDesignComponent } from './transaction-form-design-page/transaction-form-design-page.component';
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TransactionsComponent, data: { permission: 'Pages.Transactions' } },
        { path: 'create', component: ManageTransactionComponent, data: { permission: 'Pages.Transactions', isCreate: true } },
        { path: ':id', component: ManageTransactionComponent, data: { permission: 'Pages.Transactions' } },
        { path: ':id/:section', component: ManageTransactionComponent, data: { permission: 'Pages.Transactions' } },
        { path: ':transactionId/form-design/:id', component: TransactionFormDesignComponent, data: { permission: 'Pages.Transactions' } }
    ])],
    exports: [RouterModule]
})
export class TransactionsRoutingModule { }
