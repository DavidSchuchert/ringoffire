import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../../assets/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  game: any;

  constructor(private firestore: Firestore, private router: Router) {}

  async newGame() {
    try {
      let game = new Game();
      const gameInfo = await addDoc(this.getGamesColRef(), {game: game.toJson()});
      console.log(gameInfo);

      if (gameInfo.id) {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  getGamesColRef() {
    return collection(this.firestore, 'games');
  }
}