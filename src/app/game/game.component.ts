import { Component } from '@angular/core';
import { Game } from '../../assets/models/game';
import {
  MatDialog
} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  pickCardAnimation = false;
  currentCard: string = '';
  game: Game | undefined;

  constructor(public dialog: MatDialog){}
  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if(!this.pickCardAnimation){
    this.currentCard = this.game.stack.pop();
    console.log(this.currentCard);
    this.pickCardAnimation = true;
    console.log('New Card:' + this.currentCard)
    console.log('game is', this.game)

    setTimeout(() =>{
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }
}

openDialog(): void {
  const dialogRef = this.dialog.open(DialogAddPlayerComponent);

  dialogRef.afterClosed().subscribe(name => {
    this.game.players.push(name);
  });
}

}

