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
  icon: any[] = []

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  onNoClick() {
    this.dialogRef.close()
  }


  onChange(event: any) {
    const { value } = event.target;
    let index = this.players.length;
    while (index--) {
      this.players[index].isChecked = value === this.players[index]['value'];
      this.updateIcon(index);
    }
  }


  updateIcon(index: any) {
    if (this.players[index].isChecked) {
      if (this.icon.includes(index)) {
        this.icon = [];
      } else {
        this.icon = [];
        this.icon.push(index);
      }
      this.data.icon = this.icon[0];
    }
  }
}