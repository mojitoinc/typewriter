// This client was automatically generated by Segment Typewriter. ** Do Not Edit **
// To update this file, run:
//   npx typewriter

/**
 * Fired when the user generates code with Typewriter
 */
export interface CommandBuild {
    /**
     * Local Workspace configuration
     */
    config: CommandBuildConfig;
    /**
     * Duration of the command in ms
     */
    duration: number;
    /**
     * Runs in a CI environment
     */
    isCI: string;
    /**
     * Build Output mode
     */
    mode: Mode;
    /**
     * Raw command string input
     */
    rawCommand: string;
    /**
     * User Segment Workspace
     */
    workspace: string;
}

/**
 * Local Workspace configuration
 */
export interface CommandBuildConfig {
    /**
     * Language to Generate
     */
    language: string;
    /**
     * Advanced Language Options
     */
    languageOptions?: { [key: string]: any };
    /**
     * SDK to generate
     */
    sdk: string;
    /**
     * Type of token retrieval
     */
    tokenType?: TokenType;
    /**
     * Tracking Plans to generate code for
     */
    trackingPlans: PurpleTrackingPlan[];
}

/**
 * Type of token retrieval
 */
export enum TokenType {
    Global = "global",
    Input = "input",
    Script = "script",
}

export interface PurpleTrackingPlan {
    /**
     * Tracking Plan ID
     */
    id?: string;
    /**
     * Path to output code
     */
    path?: string;
}

/**
 * Build Output mode
 */
export enum Mode {
    Dev = "dev",
    Prod = "prod",
}

export interface CommandError {
    /**
     * Local Workspace configuration
     */
    config?: CommandErrorConfig;
    /**
     * Error Object
     */
    error: { [key: string]: any };
    /**
     * Exit code for the error
     */
    errorCode?: number;
    /**
     * User friendly error message
     */
    errorMessage: string;
    /**
     * Runs in a CI environment
     */
    isCI: string;
    /**
     * Raw command string input
     */
    rawCommand: string;
    /**
     * User Segment Workspace
     */
    workspace?: string;
}

/**
 * Local Workspace configuration
 */
export interface CommandErrorConfig {
    /**
     * Language to generate
     */
    language: string;
    /**
     * Advanced Language Options
     */
    languageOptions?: { [key: string]: any };
    /**
     * SDK to generate
     */
    sdk: string;
    /**
     * Type of token retrieval
     */
    tokenType?: TokenType;
    /**
     * Tracking Plans to generate code for
     */
    trackingPlans: FluffyTrackingPlan[];
}

export interface FluffyTrackingPlan {
    /**
     * Tracking Plan ID
     */
    id?: string;
    /**
     * Path to output code
     */
    path?: string;
}

export interface CommandHelp {
    /**
     * Raw command string input
     */
    rawCommand: string;
}

/**
 * Init Events that initialize the settings for typewriter
 */
export interface CommandInit {
    /**
     * Local Workspace configuration
     */
    config: CommandInitConfig;
    /**
     * Duration of the command in ms
     */
    duration: number;
    /**
     * Wether there is a workspace config already present
     */
    hasConfig?: boolean;
    /**
     * Raw command string input
     */
    rawCommand: string;
}

/**
 * Local Workspace configuration
 */
export interface CommandInitConfig {
    /**
     * Language to generate
     */
    language: string;
    /**
     * Advanced Language Options
     */
    languageOptions?: { [key: string]: any };
    /**
     * SDK to generate
     */
    sdk: string;
    /**
     * Type of token retrieval
     */
    tokenType: TokenType;
    /**
     * Tracking Plans to generate code for
     */
    trackingPlans: TentacledTrackingPlan[];
    /**
     * User Segment Workspace
     */
    workspace: string;
}

export interface TentacledTrackingPlan {
    /**
     * Tracking Plan ID
     */
    id: string;
    /**
     * Path to output code
     */
    path: string;
}

/**
 * KitchenSink Event for testing all possible data types
 */
export interface KitchenSink {
    aBoolean?:  boolean;
    aDate?:     Date;
    anArray?:   any[];
    anEnum?:    AnEnum;
    anInteger?: number;
    anObject?:  { [key: string]: any };
    aNumber?:   number;
    anything?:  any;
    aString?:   string;
}

export enum AnEnum {
    Another = "another",
    Value = "value",
}

export interface VersionCommand {
    version: string;
}


/**
 * You can install `@segment/analytics-node` by following instructions at: 
 * https://segment.com/docs/connections/sources/catalog/libraries/server/node
 */
import { Analytics, TrackParams } from '@segment/analytics-node'

/**
 * An ID associated with the user. Note: at least one of userId or anonymousId must be included!
 **/
type Identity =
    | { userId: string; anonymousId?: string }
    | { userId?: string; anonymousId: string }

/**
 * TrackMessage represents a message payload for an analytics `.track()` call.
 * See: https://segment.com/docs/spec/track/
 */
export type TrackMessage<PropertiesType> = Omit<
    TrackParams,
    'event' | 'properties'
> & { event?: string, properties: PropertiesType } & Identity

/** The callback exposed by analytics-node. */
export type Callback = Parameters<Analytics['track']>[1]

export type ViolationHandler = (
    message: TrackMessage<Record<string, any>>,
    violations: any[]
) => void

/**
 * The default handler that is fired if none is supplied with setTypewriterOptions.
 * If NODE_ENV="test", this handler will throw an error. Otherwise, it will log
 * a warning message to the console.
 */
 export const defaultValidationErrorHandler: ViolationHandler = (
    message,
    violations
) => {
    const msg = JSON.stringify(
        {
            type: 'Typewriter JSON Schema Validation Error',
            description:
                `You made an analytics call (${message.event}) using Typewriter that doesn't match the ` +
                'Tracking Plan spec.',
            errors: violations,
        },
        undefined,
        2
    )

    if (process.env.NODE_ENV === 'test') {
        throw new Error(msg)
    }
    console.warn(msg)
}


const missingAnalyticsNodeError = new Error(`You must set an analytics-node instance:

>	import { Analytics } from '@segment/analytics-node'
>	import { setTypewriterOptions } from './analytics'
>
> const analytics = new Analytics({ writeKey: 'SEGMENT_WRITE_KEY' })
>	setTypewriterOptions({ analytics: analytics	})

For more information on @segment/analytics-node, see: https://segment.com/docs/sources/server/node/quickstart/
`)

let analytics: () => Analytics | undefined = () => {
    throw missingAnalyticsNodeError
}

/** Options to customize the runtime behavior of a Typewriter client. */
export interface TypewriterOptions {
    /**
     * Underlying analytics instance where analytics calls are forwarded on to.
     */
    analytics: Analytics
    /**
     * Handler fired when if an event does not match its spec. This handler
     * does not fire in production mode, because it requires inlining the full
     * JSON Schema spec for each event in your Tracking Plan.
     *
     * By default, it will throw errors if NODE_ENV = "test" so that tests will fail
     * if a message does not match the spec. Otherwise, errors will be logged to stderr.
     */
    onViolation?: ViolationHandler
}

/**
 * Updates the run-time configuration of this Typewriter client.
 * This function must be called with a configured analytics-node instance before firing
 * any analytics calls, or else a `missingAnalyticsNodeError` error will be thrown.
 *
 * @param {TypewriterOptions} options - the options to upsert
 *
 * @typedef {Object} TypewriterOptions
 * @property {Analytics} analytics - Underlying analytics instance where analytics
 * 		calls are forwarded on to.
 * @property {Function} [onViolation] - Handler fired when if an event does not match its spec. This handler does not fire in
 * 		production mode, because it requires inlining the full JSON Schema spec for each event in your Tracking Plan. By default,
 * 		it will throw errors if NODE_ENV="test" so that tests will fail if a message does not match the spec. Otherwise, errors
 * 		will be logged to stderr.
 */
export function setTypewriterOptions(options: TypewriterOptions) {
    analytics = options.analytics ? () => options.analytics : analytics
}


/**
 * Helper to attach metadata on Typewriter to outbound requests.
 * This is used for attribution and debugging by the Segment team.
 */
function withTypewriterContext<P extends Record<string, any>, T extends TrackMessage<P>>(
    message: T
) {
    return {
        ...message,
        context: {
            ...(message.context || {}),
            typewriter: {
                language: 'typescript',
                version: '9.1.0',
            },
        },
    }
}


/**
 * Fires a 'Command Build' track call.
 * Fired when the user generates code with Typewriter
 *
 * @param {TrackMessage<CommandBuild>} message - The analytics properties that will be sent to Segment.
 * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
 * 		call is fired.
 */
 export function commandBuild(
    message: TrackMessage<CommandBuild>,
    callback?: Callback
): void {
    const event = withTypewriterContext({
        ...message,
        event: 'Command Build',
        properties: {
            ...message.properties,
        },
    });

    const a = analytics()
    if (a) {
        a.track(event,callback);
    } else {
        throw missingAnalyticsNodeError
    }
}
/**
 * Fires a 'Command Error' track call.
 * 
 *
 * @param {TrackMessage<CommandError>} message - The analytics properties that will be sent to Segment.
 * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
 * 		call is fired.
 */
 export function commandError(
    message: TrackMessage<CommandError>,
    callback?: Callback
): void {
    const event = withTypewriterContext({
        ...message,
        event: 'Command Error',
        properties: {
            ...message.properties,
        },
    });

    const a = analytics()
    if (a) {
        a.track(event,callback);
    } else {
        throw missingAnalyticsNodeError
    }
}
/**
 * Fires a 'Command Help' track call.
 * 
 *
 * @param {TrackMessage<CommandHelp>} message - The analytics properties that will be sent to Segment.
 * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
 * 		call is fired.
 */
 export function commandHelp(
    message: TrackMessage<CommandHelp>,
    callback?: Callback
): void {
    const event = withTypewriterContext({
        ...message,
        event: 'Command Help',
        properties: {
            ...message.properties,
        },
    });

    const a = analytics()
    if (a) {
        a.track(event,callback);
    } else {
        throw missingAnalyticsNodeError
    }
}
/**
 * Fires a 'Command Init' track call.
 * Init Events that initialize the settings for typewriter
 *
 * @param {TrackMessage<CommandInit>} message - The analytics properties that will be sent to Segment.
 * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
 * 		call is fired.
 */
 export function commandInit(
    message: TrackMessage<CommandInit>,
    callback?: Callback
): void {
    const event = withTypewriterContext({
        ...message,
        event: 'Command Init',
        properties: {
            ...message.properties,
        },
    });

    const a = analytics()
    if (a) {
        a.track(event,callback);
    } else {
        throw missingAnalyticsNodeError
    }
}
/**
 * Fires a 'KitchenSink' track call.
 * KitchenSink Event for testing all possible data types
 *
 * @param {TrackMessage<KitchenSink>} message - The analytics properties that will be sent to Segment.
 * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
 * 		call is fired.
 */
 export function kitchenSink(
    message: TrackMessage<KitchenSink>,
    callback?: Callback
): void {
    const event = withTypewriterContext({
        ...message,
        event: 'KitchenSink',
        properties: {
            ...message.properties,
        },
    });

    const a = analytics()
    if (a) {
        a.track(event,callback);
    } else {
        throw missingAnalyticsNodeError
    }
}
/**
 * Fires a 'VersionCommand' track call.
 * 
 *
 * @param {TrackMessage<VersionCommand>} message - The analytics properties that will be sent to Segment.
 * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
 * 		call is fired.
 */
 export function versionCommand(
    message: TrackMessage<VersionCommand>,
    callback?: Callback
): void {
    const event = withTypewriterContext({
        ...message,
        event: 'VersionCommand',
        properties: {
            ...message.properties,
        },
    });

    const a = analytics()
    if (a) {
        a.track(event,callback);
    } else {
        throw missingAnalyticsNodeError
    }
}

const clientAPI = {
    /**
     * Updates the run-time configuration of this Typewriter client.
     * This function must be called with a configured analytics-node instance before firing
     * any analytics calls, or else a `missingAnalyticsNodeError` error will be thrown.
     *
     * @param {TypewriterOptions} options - the options to upsert
     *
     * @typedef {Object} TypewriterOptions
     * @property {Analytics} analytics - Underlying analytics instance where analytics
     * 		calls are forwarded on to.
     * @property {Function} [onViolation] - Handler fired when if an event does not match its spec. This handler does not fire in
     * 		production mode, because it requires inlining the full JSON Schema spec for each event in your Tracking Plan. By default,
     * 		it will throw errors if NODE_ENV="test" so that tests will fail if a message does not match the spec. Otherwise, errors
     * 		will be logged to stderr.
     */
    setTypewriterOptions,

    /**
     * Fires a 'Command Build' track call.
     * Fired when the user generates code with Typewriter
     * 
     * @param CommandBuild props - The analytics properties that will be sent to Segment.
     * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
     * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
     * 	call is fired.
     */
    commandBuild,
    /**
     * Fires a 'Command Error' track call.
     * 
     * 
     * @param CommandError props - The analytics properties that will be sent to Segment.
     * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
     * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
     * 	call is fired.
     */
    commandError,
    /**
     * Fires a 'Command Help' track call.
     * 
     * 
     * @param CommandHelp props - The analytics properties that will be sent to Segment.
     * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
     * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
     * 	call is fired.
     */
    commandHelp,
    /**
     * Fires a 'Command Init' track call.
     * Init Events that initialize the settings for typewriter
     * 
     * @param CommandInit props - The analytics properties that will be sent to Segment.
     * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
     * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
     * 	call is fired.
     */
    commandInit,
    /**
     * Fires a 'KitchenSink' track call.
     * KitchenSink Event for testing all possible data types
     * 
     * @param KitchenSink props - The analytics properties that will be sent to Segment.
     * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
     * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
     * 	call is fired.
     */
    kitchenSink,
    /**
     * Fires a 'VersionCommand' track call.
     * 
     * 
     * @param VersionCommand props - The analytics properties that will be sent to Segment.
     * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
     * @param {Function} [callback] - An optional callback called after a short timeout after the analytics
     * 	call is fired.
     */
    versionCommand,
};

export default new Proxy<typeof clientAPI>(clientAPI, {
    get(target, method) {
        if (typeof method === 'string' && target.hasOwnProperty(method)) {
            return target[method as keyof typeof clientAPI];
        }

        return () => {
            console.warn(`⚠️  You made an analytics call (${String(method)}) that can't be found. Either:
         a) Re-generate your typewriter client: \`npx typewriter\`
         b) Add it to your Tracking Plan: https://app.segment.com/segment-oscb/protocols/tracking-plans/rs_1zTHJU9fd5mt7cndWnd4PgJbMCE`);
         const a = analytics()
         if (a) {
             a.track(
                 withTypewriterContext({
                     event: 'Unknown Analytics Call Fired',
                     properties: {
                         method,
                     },
                     userId: 'typewriter',
                 })
             )
         }
        };
    },
});

