import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchTransactionsInput, TransactionSearchDto, TransactionServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'autocomplete-transaction-input',
  styleUrls: ['./autocomplete-transaction-input.component.less'],
  templateUrl: './autocomplete-transaction-input.component.html'
})
export class AutocompleteTransactionInputComponent {
  @Input() label: string;
  @Input() isEditMode: boolean;
  @Input() transaction: TransactionSearchDto;
  @Output() transactionChange = new EventEmitter<TransactionSearchDto>();

  filteredTransactions: TransactionSearchDto[];

  constructor(
    private _transactionServiceProxy: TransactionServiceProxy
  ) { }

  filterTransactions(event): void {
    let input = new SearchTransactionsInput();
    input.name = event.query;

    this._transactionServiceProxy.searchTransaction(input).subscribe(transactions => {
        this.filteredTransactions = transactions;
    });
  }

  clear() {
    this.transaction = undefined;
    this.transactionChange.emit(this.transaction);
  }

  onSelect() {
    this.transactionChange.emit(this.transaction);
  }
}

