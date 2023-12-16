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
  getDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.newGame();

    this.route.params.subscribe( (params) => {
      if (params['id'] && this.game == undefined) {
        console.log(params['id'])
        const unsub = onSnapshot(
          doc(this.getGamesColRef(), params['id']),
          (doc: any) => {
            let gameData = doc.data();
            this.game.currentPlayer = gameData.currentplayer;
            this.game.playedCards = gameData.playedCard;
            this.game.players = gameData.players;
            this.game.stack = gameData.stack;
            console.log("Data written", this.game)
          }
        );
      }
    });
  }

  getGamesColRef() {
    return collection(this.firestore, 'games');
  }

   async newGame() {
    this.game = new Game();
    /*     let gameInfo = await addDoc(this.getGamesColRef(), {game: this.game.toJson()})
    console.log(gameInfo);  */
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
