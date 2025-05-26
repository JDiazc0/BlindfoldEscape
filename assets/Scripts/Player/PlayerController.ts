import {
  _decorator,
  CCFloat,
  Component,
  Animation,
  Vec3,
  Vec2,
  RigidBody2D,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  Input,
  input,
  KeyCode,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property({ type: CCFloat })
  public movSpeed: number = 5;

  @property({ type: CCFloat })
  public jumpForce: number = 7;

  private Direction: number = 0;
  private rb: RigidBody2D | null = null;
  private col: Collider2D | null = null;
  private anim: Animation | null = null;
  private onFloor: boolean = false;
  private isMoving: boolean = false;

  private keys: { [key: string]: boolean } = {};

  onLoad() {
    this.rb = this.node.getComponent(RigidBody2D);
    this.col = this.getComponent(Collider2D);
    this.anim = this.getComponent(Animation);

    input.on(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
    input.on(Input.EventType.KEY_UP, this.onKeyReleased, this);

    if (this.col) {
      this.col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      this.col.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }
  }

  onKeyPressed(event: any) {
    switch (event.keyCode) {
      case KeyCode.KEY_A:
      case KeyCode.ARROW_LEFT:
        this.keys["left"] = true;
        break;
      case KeyCode.KEY_D:
      case KeyCode.ARROW_RIGHT:
        this.keys["right"] = true;
        break;
      case KeyCode.KEY_W:
      case KeyCode.ARROW_UP:
      case KeyCode.SPACE:
        this.keys["jump"] = true;
        break;
    }
  }

  onKeyReleased(event: any) {
    switch (event.keyCode) {
      case KeyCode.KEY_A:
      case KeyCode.ARROW_LEFT:
        this.keys["left"] = false;
        break;
      case KeyCode.KEY_D:
      case KeyCode.ARROW_RIGHT:
        this.keys["right"] = false;
        break;
      case KeyCode.KEY_W:
      case KeyCode.ARROW_UP:
      case KeyCode.SPACE:
        this.keys["jump"] = false;
        break;
    }
  }

  update(deltaTime: number) {
    this.handleMovement();
    this.handleJump();
    this.updateAnimation();
  }

  private handleMovement() {
    this.Direction = 0;
    this.isMoving = false;

    if (this.keys["left"]) {
      this.Direction = -1;
      this.node.scale = new Vec3(-1, 1, 1);
      this.isMoving = true;
    }
    if (this.keys["right"]) {
      this.Direction = 1;
      this.node.scale = new Vec3(1, 1, 1);
      this.isMoving = true;
    }

    if (this.Direction !== 0) {
      const currentVelocity = this.rb.linearVelocity;
      const targetVelocityX = this.Direction * this.movSpeed;
      this.rb.linearVelocity = new Vec2(targetVelocityX, currentVelocity.y);
    } else {
      const currentVelocity = this.rb.linearVelocity;
      const friction = 0.8;
      this.rb.linearVelocity = new Vec2(
        currentVelocity.x * friction,
        currentVelocity.y
      );
    }
  }

  private handleJump() {
    if (this.keys["jump"] && this.onFloor) {
      this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x, 0);
      this.rb.applyLinearImpulse(new Vec2(0, this.jumpForce), Vec2.ZERO, true);
      this.onFloor = false;
    }
  }

  private updateAnimation() {
    if (!this.anim) return;

    if (this.isMoving) {
      if (!this.anim.getState("Run").isPlaying) {
        this.anim.play("Run");
      }
    } else {
      if (!this.anim.getState("Idle").isPlaying) {
        this.anim.play("Idle");
      }
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    if (otherCollider.group === 2) {
      this.onFloor = true;
    }
  }

  onEndContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    if (otherCollider.group === 2) {
      this.onFloor = false;
    }
  }
}
