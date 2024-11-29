
import { Monster } from "../entities/Monster";
import { Player } from "../entities/Player";

// src/game/scenes/GameScene.ts
export class GameScene extends Phaser.Scene {
  private player?: Player;
  private monsters: Monster[] = [];
  private worldTiles: Phaser.GameObjects.Rectangle[][] = [];
  private walls: Phaser.GameObjects.Rectangle[] = [];
  private statusText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    this.createWorld();
    this.createPlayer();
    this.spawnMonsters();

    // Add status text
    this.statusText = this.add.text(16, 16, "", {
      color: "#fff",
      backgroundColor: "#000000aa",
      padding: { x: 5, y: 5 },
    });
  }

  private createWorld(): void {
    // Create floor tiles
    for (let y = 0; y < 19; y++) {
      this.worldTiles[y] = [];
      for (let x = 0; x < 25; x++) {
        const color = (x + y) % 2 === 0 ? 0x394f2a : 0x3f5930;
        const tile = this.add.rectangle(x * 32, y * 32, 32, 32, color);
        this.worldTiles[y][x] = tile;
      }
    }

    // Add walls
    const wallPositions = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 15, y: 10 },
      { x: 15, y: 11 },
      { x: 15, y: 12 },
    ];

    wallPositions.forEach((pos) => {
      const wall = this.add.rectangle(pos.x * 32, pos.y * 32, 32, 32, 0x666666);
      this.walls.push(wall);
    });
  }

  private createPlayer(): void {
    this.player = new Player(this, 400, 300);
  }

  private spawnMonsters(): void {
    const positions = [
      { x: 200, y: 200 },
      { x: 600, y: 400 },
      { x: 300, y: 500 },
    ];

    positions.forEach((pos) => {
      const monster = new Monster(this, pos.x, pos.y);
      if (this.player) {
        monster.setTarget(this.player);
      }
      this.monsters.push(monster);
    });
  }
    // Add this method - it's needed by Player and Monster for collision detection
    public checkCollision(x: number, y: number, width: number = 16, height: number = 16): boolean {
        const bounds = new Phaser.Geom.Rectangle(x - width/2, y - height/2, width, height);
        return this.walls.some(wall => Phaser.Geom.Rectangle.Overlaps(bounds, wall.getBounds()));
      }

  update(): void {
    // Update status text
    if (this.statusText && this.player) {
      this.statusText.setText(
        `HP: ${this.player.getHp()}/${this.player.getMaxHp()}\n` +
          `Monsters: ${this.monsters.length}`
      );
    }

    // Update player with reference to monsters for combat
    this.player?.update(this.monsters);

    // Update monsters
    this.monsters.forEach((monster) => monster.update());

    // Clean up dead monsters
    this.monsters = this.monsters.filter((monster) => {
      if (!monster.isAlive()) {
        monster.destroy();
        return false;
      }
      return true;
    });
  }
}
