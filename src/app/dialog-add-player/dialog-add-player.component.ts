import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../game/game.component';

@Component({
  selector: 'app-dialog-add-player',
  templateUrl: './dialog-add-player.component.html',
  styleUrls: ['./dialog-add-player.component.scss']
})
export class DialogAddPlayerComponent {
  players = [
    { 'value': '0', isChecked: false },
    { 'value': '1', isChecked: false },
    { 'value': '2', isChecked: false },
    { 'value': '3', isChecked: false }
  ];

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }


  onNoClick() {
    this.dialogRef.close()
  }


  onChange(event: any) {
    const { value } = event.target;
    let index = this.players.length;
    while (index--) {
      this.players[index].isChecked = value === this.players[index]['value'];
    }
    this.data.icon = value
  }
}
