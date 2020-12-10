import { Player } from '../player';

/** @internal */
type Constructor<T = {}> = new (...args: any[]) => T;

/** 
 * This is a bit of a hack to get a player component class to wrap a Player instance, 
 * while also inheriting all of the Player API's methods and properties.
 * 
 * The resulting PlayerMixinClass will get a Player instance on this.player, 
 * and all of the Player API methods and properties applied as wrappers.
 * 
 * e.g. 
 * - PlayerMixinClass.play() will have the same behaviour as Player.play(), but will call this.player.play() internally.
 * - PlayerMixinClass.paused will have getters and setters to match it to this.player.paused.
 * @internal
 */
export function PlayerMixin<TargetBase extends Constructor>(Target: TargetBase) {
  class PlayerMixinClass extends Target {
    // the player instance that Mixin will be wrapping
    public player: Player;

    // Mixin needs to re-define all the normal player properties, but most should be made readonly anyway...

    get canvas() {
      return this.player.canvas;
    }

    get audio() {
      return this.player.audio;
    }

    get canvasEl() {
      return this.player.canvasEl;
    }

    get note() {
      return this.player.note;
    }

    get noteFormat() {
      return this.player.noteFormat;
    }

    get meta() {
      return this.player.meta;
    }

    get duration() {
      return this.player.duration;
    }

    get layerVisibility() {
      return this.player.layerVisibility;
    }

    get autoplay() {
      return this.player.autoplay;
    }
  
    set autoplay(value: boolean) {
      this.player.autoplay = value;
    }
  };

  // make sure mixin class gets the player types
  interface PlayerMixinClass extends Player {}

  // add all Player API methods and getter/setter props to target
  for (let key of Reflect.ownKeys(Player.prototype)) {
    let desc = Object.getOwnPropertyDescriptor(Player.prototype, key);

    // don't override stuff that already exists, and ignore JS prototype junk
    if (key in Target.prototype || key === 'constructor' || key === 'name' || key === 'prototype') {
      continue;
    }
    // override methods to call e.g. `this.player.methodName()` when `methodName()` is called
    else if (desc.value && typeof desc.value === 'function') {
      Object.defineProperty(PlayerMixinClass.prototype, key, {
        ...desc,
        value: function(...args: any[]) {
          return this.player[key](...args);
        }
      });
    }
    // override getters and setters so that e.g. `property` will always reflect `this.player.property`
    else if (desc.get || desc.set) {
      Object.defineProperty(PlayerMixinClass.prototype, key, {
        ...desc,
        set: function(value: any) {
          this.player[key] = value;
        },
        get: function() {
          return this.player[key];
        }
      });
    }
  }

  return PlayerMixinClass;
}