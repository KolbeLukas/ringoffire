import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, doc, updateDoc, docData, deleteDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LegalNoticeComponent } from '../legal-notice/legal-notice.component';


export interface DialogData {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game!: Game;
  noCardLeft: boolean = false;
  gameId!: string;
  game$!: Observable<any>;
  subscriber$: any;
  playerData: DialogData = {
    name: '',
    icon: ''
  };

  constructor(private route: ActivatedRoute, private firestore: Firestore, public dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.newGame();
    this.loadGame();
  }


  newGame() {
    this.game = new Game;
  }


  loadGame() {
    this.route.params.subscribe(async param => {
      this.gameId = param['id'];
      const docRef = doc(this.firestore, 'games', this.gameId);
      this.game$ = docData(docRef);
      this.subscriber$ = this.game$.subscribe(game => {
        this.game.players = game['players'];
        this.game.playersIcon = game['playersIcon'];
        this.game.stack = game['stack'];
        this.game.playedCards = game['playedCards'];
        this.game.currentPlayer = game['currentPlayer'];
        this.game.pickCardAnimation = game['pickCardAnimation'];
        this.game.currentCard = game['currentCard'];
        this.game.visibleStack = game['visibleStack'];
        this.game.stackCount = game['stackCount'];
        this.game.cardTurn = game['cardTurn'];
      })
    });
  }


  getParentMethod(): any {
    return {
      callParentMethod: () => {
        this.saveGame()
      }
    }
  }


  saveGame() {
    const docRef: any = doc(this.firestore, 'games', this.gameId);
    updateDoc(docRef, this.game.toJson());
  }


  takeCard() {
    this.checkIfPlayer();
    if (!this.game.pickCardAnimation && this.game.players.length > 0) {
      this.game.currentCard = this.game.stack.pop();
      this.saveGame();
      this.playAnimation();
      this.updateVisibleStack();
      this.turnPlayedCard();
    }
  }


  checkIfPlayer() {
    if (this.game.players.length > 0) {
      return;
    } else {
      this.openDialog();
    }
  }


  playAnimation() {
    this.game.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    this.saveGame();
    setTimeout(() => {
      let currentCard: string = this.game.currentCard ?? '';
      this.game.playedCards.push(currentCard);
      this.game.pickCardAnimation = false;
      this.saveGame();
    }, 1000);
  }


  turnPlayedCard() {
    setTimeout(() => {
      this.game.cardTurn++
      this.game.cardTurn = this.game.cardTurn % 3;
      this.saveGame();
    }, 1000);

  }


  updateVisibleStack() {
    if (this.game.stackCount >= this.game.stack.length) {
      this.game.stackCount--;
      this.game.visibleStack = this.game.stack.slice(0, this.game.stackCount);
    }
    if (this.game.stackCount == 0) {
      this.noCardLeft = true;
    }
    this.saveGame();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
      data: { name: this.playerData.name, icon: this.playerData.icon }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.name.length > 0) {
        this.game.players.push(data.name);
        this.game.playersIcon.push(data.icon);
        this.saveGame();
      }
    });
  }


  gameOver() {
    this.subscriber$.unsubscribe();
    const docRef: any = doc(this.firestore, 'games', this.gameId);
    deleteDoc(docRef);
  }

  openLegalNotice() {
    this.dialog.open(LegalNoticeComponent);
  }
}