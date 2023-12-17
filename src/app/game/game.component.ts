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
  game: Game = new Game();
  gamesRef: 'games';
  gameId: string;

  unsubList;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      if (params['id'] /*  && this.game == undefined */) {
        console.log('ID:', params['id']);
        const unsub = onSnapshot(
          doc(this.getGamesColRef(), params['id']),
          (doc: any) => {
            let gameData = doc.data();

            this.game.currentPlayer = gameData.currentPlayer;
            this.game.playedCards = gameData.playedCard;
            this.game.players = gameData.players;
            this.game.stack = gameData.stack;
            this.game.pickCardAnimation = gameData.pickCardAnimation;
            this.game.currentCard = gameData.currentCard;
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
  }

  takeCard() {
    if (!this.game.pickCardAnimation && this.game.players.length >= 2) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      console.log(this.game.currentPlayer);

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    } else{
      alert('Please add at least 2 players')
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  async saveGame() {
    console.log('test');
    await updateDoc(
      doc(collection(this.firestore, 'games'), this.gameId),
      this.game.toJson()
    ).catch((err) => {
      console.log(err);
    });
  }
}
