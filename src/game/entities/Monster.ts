// src/game/entities/Monster.ts
import { Character } from './Character';
import { Player } from './Player';
import { GameScene } from '../scenes/GameScene';

export class Monster extends Character {
  private target?: Player;
  private chaseRange: number = 200;
  private attackRange: number = 20;
  private lastAttackTime: number = 0;
  private attackCooldown: number = 1000;
  private gameScene: GameScene; // Changed from 'scene' to 'gameScene' to avoid conflict

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 50, 1);
    this.gameScene = scene as GameScene;
    this.createSprite();
  }

  private createSprite(): void {
    const body = this.scene.add.rectangle(0, 0, 20, 20, 0xff0000);
    this.container.add(body);
  }

  public setTarget(target: Player): void {
    this.target = target;
  }

  public update(): void {
    if (!this.isAlive() || !this.target) return;

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.target.getPosition().x,
      this.target.getPosition().y
    );

    if (distance <= this.chaseRange) {
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.target.getPosition().x,
        this.target.getPosition().y
      );

      const nextX = this.x + Math.cos(angle) * this.speed;
      const nextY = this.y + Math.sin(angle) * this.speed;

      // Check collision before moving
      if (!this.gameScene.checkCollision(nextX, nextY)) {
        this.x = nextX;
        this.y = nextY;
        this.container.setPosition(this.x, this.y);
      }

      // Attack if in range
      if (distance <= this.attackRange) {
        const currentTime = this.scene.time.now;
        if (currentTime - this.lastAttackTime >= this.attackCooldown) {
          this.target.takeDamage(10);
          this.lastAttackTime = currentTime;
        }
      }
    }
  }

  public destroy(): void {
    this.container.destroy();
  }
}