// src/game/entities/Character.ts
import { Entity } from '../core/Entity';

export abstract class Character extends Entity {
  protected hp: number;
  protected maxHp: number;
  protected speed: number;
  protected healthBar?: Phaser.GameObjects.Rectangle;
  protected healthBarBackground?: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, hp: number, speed: number) {
    super(scene, x, y);
    this.hp = hp;
    this.maxHp = hp;
    this.speed = speed;
    this.createHealthBar();
  }

  protected createHealthBar(): void {
    this.healthBarBackground = this.scene.add.rectangle(0, -15, 32, 4, 0x000000);
    this.healthBar = this.scene.add.rectangle(0, -15, 32, 4, 0xff0000);
    this.container.add([this.healthBarBackground, this.healthBar]);
  }

  public takeDamage(amount: number): void {
    this.hp = Math.max(0, this.hp - amount);
    this.updateHealthBar();
  }

  protected updateHealthBar(): void {
    if (this.healthBar) {
      this.healthBar.width = (this.hp / this.maxHp) * 32;
    }
  }

  public isAlive(): boolean {
    return this.hp > 0;
  }

  public getHp(): number {
    return this.hp;
  }

  public getMaxHp(): number {
    return this.maxHp;
  }
}