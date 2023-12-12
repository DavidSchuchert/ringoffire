import { Component, Injectable, inject } from '@angular/core';
import { Game } from '../../assets/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import {
  Firestore,
  collection,
  doc,
  collectionData,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  query,
  where,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game | undefined;
  gamesRef: 'games';


  constructor(private firestore: Firestore, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.newGame();
  }

  getGamesColRef() {
    return collection(this.firestore, 'games');
  }

  async newGame() {
    this.game = new Game();
    await setDoc(doc(this.getGamesColRef()), {
      name: (this.game.toJson())
    });
    
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      console.log(this.currentCard);
      this.pickCardAnimation = true;
      console.log('New Card:' + this.currentCard);
      console.log('game is', this.game);

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length < 0) {
        this.game.players.push(name);
      }
    });
  }
}
