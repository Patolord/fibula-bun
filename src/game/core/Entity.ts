// src/game/core/Entity.ts
export abstract class Entity {
    protected scene: Phaser.Scene;
    protected container: Phaser.GameObjects.Container;
    protected x: number;
    protected y: number;
  
    constructor(scene: Phaser.Scene, x: number, y: number) {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.container = scene.add.container(x, y);
    }
  
    public getPosition(): { x: number; y: number } {
      return { x: this.x, y: this.y };
    }
  
    public abstract update(...args: any[]): void;
    public abstract destroy(): void;
  }