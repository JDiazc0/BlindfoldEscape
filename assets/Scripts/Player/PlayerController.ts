import {
  _decorator,
  CCFloat,
  CCInteger,
  Collider2D,
  Component,
  Contact2DType,
  debug,
  EventKeyboard,
  Input,
  input,
  IPhysics2DContact,
  KeyCode,
  Node,
  PhysicsSystem2D,
  RigidBody2D,
  Vec2,
  Vec3,
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
  private onFloor: boolean = false;

  private keys: { [key: string]: boolean } = {};

  onLoad() {
    this.rb = this.node.getComponent(RigidBody2D);
    this.col = this.getComponent(Collider2D);

    input.on(Input.EventType.KEY_DOWN, this.onKeyPressed, this);
    input.on(Input.EventType.KEY_UP, this.onKeyReleased, this);

    if (this.col) {
      this.col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      this.col.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }
  }

  onKeyPressed(event: EventKeyboard) {
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

  onKeyReleased(event: EventKeyboard) {
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
  }

  private handleMovement() {
    this.Direction = 0;

    if (this.keys["left"]) {
      this.Direction = -1;
    }
    if (this.keys["right"]) {
      this.Direction = 1;
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
