import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LegalNoticeComponent>) { }

  ngOnInit(): void {
  }

  closeLegalNotice() {
    this.dialogRef.close();
  }

}
