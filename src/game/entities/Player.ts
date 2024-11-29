import { GameScene } from '../scenes/GameScene';
import { Character } from './Character';
import { Monster } from './Monster';

export class Player extends Character {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private weapon?: Phaser.GameObjects.Rectangle;
  private spaceKey: Phaser.Input.Keyboard.Key;
  private lastAttackTime: number = 0;
  private attackCooldown: number = 1000; // 1 second
  private attackRange: number = 100; // Increased from 50 to 100
  private attackRangeIndicator?: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 100, 3);
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.spaceKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.createSprite();
    this.createAttackRangeIndicator();
  }

  private createSprite(): void {
    const head = this.scene.add.circle(0, -8, 6, 0xffcccb);
    const body = this.scene.add.rectangle(0, 4, 16, 20, 0x6495ed);
    this.weapon = this.scene.add.rectangle(-10, 4, 4, 16, 0xc0c0c0);
    const shield = this.scene.add.rectangle(10, 4, 8, 12, 0x8b4513);
    
    this.container.add([body, head, this.weapon, shield]);
  }

  private createAttackRangeIndicator(): void {
    // Create a circle to show attack range, initially invisible
    this.attackRangeIndicator = this.scene.add.circle(0, 0, this.attackRange, 0xff0000, 0.1);
    this.attackRangeIndicator.setVisible(false);
    this.container.add(this.attackRangeIndicator);
  }

  public attack(monsters: Monster[]): void {
    const currentTime = this.scene.time.now;
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      let hitSomething = false;
      
      monsters.forEach(monster => {
        const distance = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          monster.getPosition().x,
          monster.getPosition().y
        );
        
        if (distance <= this.attackRange) {
          monster.takeDamage(20);
          hitSomething = true;
        }
      });

      if (hitSomething) {
        // Visual feedback for successful attack
        if (this.weapon) {
          this.scene.tweens.add({
            targets: this.weapon,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 100,
            yoyo: true
          });
        }
      }

      this.lastAttackTime = currentTime;
    }
  }

  public update(monsters: Monster[]): void {
    if (!this.isAlive()) return;

    // Movement
    const nextPos = { x: this.x, y: this.y };
    
    if (this.cursors.left.isDown) nextPos.x -= this.speed;
    else if (this.cursors.right.isDown) nextPos.x += this.speed;
    if (this.cursors.up.isDown) nextPos.y -= this.speed;
    else if (this.cursors.down.isDown) nextPos.y += this.speed;

    // Update position if moved
    if (nextPos.x !== this.x || nextPos.y !== this.y) {
      const gameScene = this.scene as GameScene;
      if (!gameScene.checkCollision(nextPos.x, nextPos.y)) {
        this.x = nextPos.x;
        this.y = nextPos.y;
        this.container.setPosition(this.x, this.y);
      }
    }

    // Show attack range indicator when space is held down
    if (this.attackRangeIndicator) {
      this.attackRangeIndicator.setVisible(this.spaceKey.isDown);
    }

    // Check for attack
    if (this.spaceKey.isDown) {
      this.attack(monsters);
    }
  }

  public destroy(): void {
    this.container.destroy();
  }
}