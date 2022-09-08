import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  @Input() name: any;
  @Input() icon: any;
  @Input() playerActive: boolean = false;
  @Input() game: any;
  @Input() id: any;
  @Input() save !: any;

  deletePlayer() {
    this.game.players.splice(this.id, 1);
    this.game.playersIcon.splice(this.id, 1)
    this.save.callParentMethod();
  }
}
