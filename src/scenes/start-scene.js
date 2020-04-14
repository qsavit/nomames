import { Server } from '../server';
import { TextButton } from '../text-button';
import { DraggersLabel } from '../draggerslabel';
import { SeatZone } from '../seatzone';

export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'startScene' });
    };

    preload() {
        this.load.html('nameform', 'assets/nameform.html');
        this.load.html('hoststartform', 'assets/hoststartform.html');
    };

    create() {
        this.server = new Server({
            onPlayersUpdate: (players) => {
                this.onPlayersUpdate(players);
            },
            onGameStart: (msg) => {
                this.scene.start('diceScene', { server: this.server });
            }
        });

        let text = this.add.text(50,30,'Welcome! \n\nTo start, enter a game ID\nThis will create a game.',{ color: 'white', fontSize: '20px '});

        this.hostJoinEl = this.add.dom(360, 150).createFromCache('hoststartform');
        this.hostJoinEl.addListener('click');
        this.hostJoinEl.on('click', (event) => {
            if (event.target.name === 'playButton') {
                let inputText = this.hostJoinEl.getChildByName('gameIdField');
                if (inputText.value !== '') {
                    this.hostJoinEl.removeListener('click');
                    this.server.connect(inputText.value);
                    this.nameEl.setVisible(true);
                    this.hostJoinEl.setVisible(false);
                    this.channelText.setVisible(true);
                    this.channelText.setText('GameID: ' + inputText.value);
                    this.playersLabel.setVisible(true);
                }
            }
        });

        this.channelText = this.add.text(50, 150, '', { color: '#0f0', fontsize: '36px' });
        this.channelText.setVisible(false);

        this.nameEl = this.add.dom(360, 200).createFromCache('nameform');
        this.nameEl.setVisible(false);
        this.nameEl.addListener('click');
        this.nameEl.on('click', (event) => {
            if (event.target.name === 'playButton') {
                let inputText = this.nameEl.getChildByName('nameField');
                if (inputText.value !== '') {
                    this.nameEl.removeListener('click');
                    this.nameEl.setVisible(false);
                    this.server.setName(inputText.value);
                    this.nameText.setText('Name: ' +inputText.value);
                    this.nameText.setVisible(true);
                    this.startButton.setVisible(true);
                    this.directionText.setVisible(true);
                    this.seat1.setVisible(true);
                }
            }

        });

        this.nameText = this.add.text(50,200, '',{color: '#0f0', fontsize: '36px'});
        this.nameText.setVisible(false);
        this.directionText = this.add.text(50,350,'To set the order of players,\nplease drag their name to a seat', {color: '#0f0', fontsize: '24px'});
        this.directionText.setVisible(false);

        
        this.startButton = new TextButton(this, 50, 300, '[ START ]', {
            onClick: () => {
                this.server.startGame();
            }
        });
        this.add.existing(this.startButton);
        this.startButton.setVisible(false);

        let playersList = this.server.getPlayersList();
        this.playersLabel = new DraggersLabel(this, 20, 400, playersList);

        this.add.existing(this.playersLabel);
        this.playersLabel.setVisible(false);

        this.seat1 = new SeatZone(this, 500, 200, 100, 80, 'Seat 1');
        this.add.existing(this.seat1);
        this.seat1.setVisible(false);

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragenter', function(pointer, gameObject, dropZone) {
            dropZone.setHighlighted(true);
        });

        this.input.on('dragleave', function(pointer, gameObject, dropZone) {
            dropZone.setHighlighted(false);
        });

        this.input.on('drop', function(pointer, gameObject, dropZone) {
            dropZone.add(gameObject);
            dropZone.setHighlighted(false);
        });

        this.input.on('dragend', function(pointer, gameObject, dropZone) {
            if (!dropZone) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });


    }

    
    onPlayersUpdate(playersList) {
        console.log("Players update!");
        this.playersLabel.updateWithPlayers(playersList);
    }
}