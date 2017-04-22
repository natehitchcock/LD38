declare module pc {
    export let BODYTYPE_DYNAMIC : any;
    export let KEY_Q : any;
    export let KEY_W : any;
    export let KEY_A : any;
    export let KEY_S : any;
    export let KEY_D : any;

    export let RENDERSTYLE_SOLID: any;

    // function hacks
    export let createScript: any;

    export let createBox: any;

    // class hacks
    export class StandardMaterial{
        
    }

    export class GraphNode{
        setPosition: any;
        setLocalPosition:any;
    }
    
    // End of 'any' hacks

    export class Application {
        constructor(canvas: HTMLElement, options: any);
        start: () => void;
        setCanvasFillMode: (mode: any) => void;
        setCanvasResolution: (mode: any) => void;
        resizeCanvas: (width?: number, height?: number) => void;
        on: (event: string, any: any) => void;

        root: Entity;
        loader: pc.resources.ResourceLoader;
        assets: pc.asset.AssetRegistry;
        systems: ComponentSystemRegistry;
        scene: Scene;
        touch: pc.input.TouchDevice;
        keyboard: pc.input.Keyboard;
        mouse: pc.input.Mouse;
        graphicsDevice: pc.GraphicsDevice;
    }

    export class GraphicsDevice{

    }
    
    export class MeshInstance{
        constructor(node: GraphNode, mesh: any, material: Material, renderStyle?: any, visible?: boolean)
        getMaterials: any;
    }

    export class input {
        static KEY_SPACE: number;
        static EVENT_MOUSEDOWN: string;
    }

    export module input {
        export class Mouse {
            constructor(canvas: HTMLElement);
            on: (event: string, callback: (event: any) => void, context: any) => void;
            static isPointerLocked: () => boolean;
        }
        export class Keyboard {
            constructor(canvas: HTMLElement);
            wasPressed: (key: number) => boolean;
        }
        export class TouchDevice {
            constructor(canvas: HTMLElement);
            on: (event: string, callback: (event: any) => void, context: any) => void;
        }
    }

    export class script {
        static create: (name: string, script: (app: Application) => any) => void;
    }

    export module resources {
        export class ResourceLoader {

        }
    }

    export module asset {
        export class Asset {
            resource: pc.resource;
        }
        export class AssetRegistry {
            find: (name: string) => pc.asset.Asset;
            loadFromUrl: (url: string, type: string) => any;
        }
    }

    export class Entity extends GraphNode {
        addComponent: (type: string, options?: any) => void;
        removeComponent: (type: string) => void;
        addChild: (e: GraphNode) => void;
        getChildren(): Entity[];
        constructor(name?: string);

        getLocalScale: () => pc.Vec3;
        getPosition: () => pc.Vec3;
        getLocalPosition: () => pc.Vec3;

        setLocalPosition: {
            (x: number, y: number, z: number): void;
            (position: pc.Vec3): void;
        }
        setPosition: {
            (x: number, y: number, z: number): void;
            (position: pc.Vec3): void;
        }
        setEulerAngles: {
            (x: number, y: number, z: number): void;
            (angles: pc.Vec3): void;
        }
        setLocalScale: {
            (x: number, y: number, z: number): void;
        }

        translateLocal: {
            (x: number, y: number, z: number): void;
        }
        rotateLocal: {
            (x: number, y: number, z: number): void;
        }
        rotate: (ex: number, ey: number, ez: number) => void;

        getName: () => string;
        setName: (name: string) => void;

        addLabel: (label: string) => void;
        findByLabel: (label: string) => Entity[];

        name: string;
        label: string;
        displayOnly: boolean;
        enabled: boolean;

        model: ModelComponent;
        rigidbody: RigidBodyComponent;
        script: ScriptComponent;
    }

    export class Scene {
        ambientLight: Color;
        addModel: any;
    }

    export class RigidBodyComponent {
        applyForce: (x: number, y: number, z: number) => void;
        applyTorque: (x: number, y: number, z: number) => void;
        syncEntityToBody: () => void;
        isActive: () => boolean;
        activate: () => void;
        setGravity: (x: number, y: number, z: number) => void;

        angularDamping: {};
        angularFactor: {};
        angularVelocity: {};
        enabled: {};
        friction: {};
        group: {};
        linearDamping: {};
        linearFactor: {};
        linearVelocity: {};
        _linearVelocity: {};
        mask: {};
        mass: {};
        restitution: {};
        type: {}
    }

    export class ModelComponent extends Model {
        material: PhongMaterial;
        enabled: boolean;
        
    }

    export class ScriptComponent {
        [key: string] : any;
        enabled: boolean;

        font_renderer: any;

        create: any;
    }

    export class ComponentSystemRegistry {
        rigidbody: RigidBodyComponent;
    }

    export class Vec3 {
        constructor(x: number, y: number, z: number);
        constructor();
        static ZERO: Vec3

        x: number;
        y: number;
        z: number;

        translate: (x: number, y: number, z: number) => Vec3;
        clone: () => Vec3;
        scale: (x: number) => Vec3;
        data: Float32Array;
    }

    export class Vec2 {
        constructor(x: number, y: number, z: number);
        static ONE: Vec2;

        clone: () => Vec2;
        scale: (scale: number) => Vec2;
    }

    export class Color {
        constructor(r: number, g: number, b: number, a: number);
        constructor(r: number, g: number, b: number);

        r: number;
        g: number;
        b: number;
        a: number;
    }

    export class Texture extends resource { }

    export class Material { }

    export class Model extends resource {
        graph: GraphNode;
        meshInstances: MeshInstance[];
     }


    export class PhongMaterial extends Material {
        diffuse: Color;
        diffuseMap: resource;
        diffuseMapTiling: Vec2;
        update: () => void;

    }


    export class resource { }

    export var FILLMODE_FILL_WINDOW: any;
    export var RESOLUTION_AUTO: any;

    export module math {
        export var random: (min: number, max: number) => number;
    }

    export class promise {
        static all: (promises: any[]) => promise;
        then: {
            (success: (value: any) => void): void;
            (success: (value: any) => void, failure: (value: any) => void): void;
        }
    }
}