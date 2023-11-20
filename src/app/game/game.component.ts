import { Component } from '@angular/core';
import { Game } from '../../assets/models/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  pickCardAnimation = false;
  currentCard: string = '';
  game: Game | undefined;

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

}
