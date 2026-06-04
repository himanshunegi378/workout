
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * Authenticated user (credentials-based auth).
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Feedback
 * User-submitted product feedback or suggestions.
 */
export type Feedback = $Result.DefaultSelection<Prisma.$FeedbackPayload>
/**
 * Model Exercise
 * A single, reusable exercise definition.
 */
export type Exercise = $Result.DefaultSelection<Prisma.$ExercisePayload>
/**
 * Model Programme
 * A named collection / programme of workouts (e.g. "Push Pull Legs").
 */
export type Programme = $Result.DefaultSelection<Prisma.$ProgrammePayload>
/**
 * Model ProgrammeActivityLog
 * 
 */
export type ProgrammeActivityLog = $Result.DefaultSelection<Prisma.$ProgrammeActivityLogPayload>
/**
 * Model Workout
 * A named workout containing an ordered list of exercises.
 */
export type Workout = $Result.DefaultSelection<Prisma.$WorkoutPayload>
/**
 * Model WorkoutSession
 * A single logged training session tied to a Workout.
 */
export type WorkoutSession = $Result.DefaultSelection<Prisma.$WorkoutSessionPayload>
/**
 * Model ExerciseWithMetadata
 * An exercise as it appears inside a specific Workout, with prescribed
 * sets / reps / tempo / rest parameters.
 */
export type ExerciseWithMetadata = $Result.DefaultSelection<Prisma.$ExerciseWithMetadataPayload>
/**
 * Model ExerciseLog
 * A single logged set within a WorkoutSession.
 */
export type ExerciseLog = $Result.DefaultSelection<Prisma.$ExerciseLogPayload>
/**
 * Model SessionExerciseLog
 * Links one logged set to its workout session and optional programme metadata.
 * The one-to-one ExerciseLog relation preserves the planned-vs-ad-hoc source of each set.
 */
export type SessionExerciseLog = $Result.DefaultSelection<Prisma.$SessionExerciseLogPayload>
/**
 * Model exercise_analytics_view
 * Analytics view consolidating log data
 */
export type exercise_analytics_view = $Result.DefaultSelection<Prisma.$exercise_analytics_viewPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MuscleGroup: {
  Abs: 'Abs',
  Back: 'Back',
  Biceps: 'Biceps',
  Cardio: 'Cardio',
  Chest: 'Chest',
  Forearms: 'Forearms',
  Legs: 'Legs',
  Shoulders: 'Shoulders',
  Triceps: 'Triceps'
};

export type MuscleGroup = (typeof MuscleGroup)[keyof typeof MuscleGroup]


export const FeedbackStatus: {
  Submitted: 'Submitted',
  UnderReview: 'UnderReview',
  Planned: 'Planned',
  Completed: 'Completed',
  Rejected: 'Rejected'
};

export type FeedbackStatus = (typeof FeedbackStatus)[keyof typeof FeedbackStatus]

}

export type MuscleGroup = $Enums.MuscleGroup

export const MuscleGroup: typeof $Enums.MuscleGroup

export type FeedbackStatus = $Enums.FeedbackStatus

export const FeedbackStatus: typeof $Enums.FeedbackStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feedback`: Exposes CRUD operations for the **Feedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feedbacks
    * const feedbacks = await prisma.feedback.findMany()
    * ```
    */
  get feedback(): Prisma.FeedbackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exercise`: Exposes CRUD operations for the **Exercise** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Exercises
    * const exercises = await prisma.exercise.findMany()
    * ```
    */
  get exercise(): Prisma.ExerciseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.programme`: Exposes CRUD operations for the **Programme** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Programmes
    * const programmes = await prisma.programme.findMany()
    * ```
    */
  get programme(): Prisma.ProgrammeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.programmeActivityLog`: Exposes CRUD operations for the **ProgrammeActivityLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProgrammeActivityLogs
    * const programmeActivityLogs = await prisma.programmeActivityLog.findMany()
    * ```
    */
  get programmeActivityLog(): Prisma.ProgrammeActivityLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workout`: Exposes CRUD operations for the **Workout** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workouts
    * const workouts = await prisma.workout.findMany()
    * ```
    */
  get workout(): Prisma.WorkoutDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workoutSession`: Exposes CRUD operations for the **WorkoutSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkoutSessions
    * const workoutSessions = await prisma.workoutSession.findMany()
    * ```
    */
  get workoutSession(): Prisma.WorkoutSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exerciseWithMetadata`: Exposes CRUD operations for the **ExerciseWithMetadata** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExerciseWithMetadata
    * const exerciseWithMetadata = await prisma.exerciseWithMetadata.findMany()
    * ```
    */
  get exerciseWithMetadata(): Prisma.ExerciseWithMetadataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exerciseLog`: Exposes CRUD operations for the **ExerciseLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExerciseLogs
    * const exerciseLogs = await prisma.exerciseLog.findMany()
    * ```
    */
  get exerciseLog(): Prisma.ExerciseLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sessionExerciseLog`: Exposes CRUD operations for the **SessionExerciseLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SessionExerciseLogs
    * const sessionExerciseLogs = await prisma.sessionExerciseLog.findMany()
    * ```
    */
  get sessionExerciseLog(): Prisma.SessionExerciseLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exercise_analytics_view`: Exposes CRUD operations for the **exercise_analytics_view** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Exercise_analytics_views
    * const exercise_analytics_views = await prisma.exercise_analytics_view.findMany()
    * ```
    */
  get exercise_analytics_view(): Prisma.exercise_analytics_viewDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Feedback: 'Feedback',
    Exercise: 'Exercise',
    Programme: 'Programme',
    ProgrammeActivityLog: 'ProgrammeActivityLog',
    Workout: 'Workout',
    WorkoutSession: 'WorkoutSession',
    ExerciseWithMetadata: 'ExerciseWithMetadata',
    ExerciseLog: 'ExerciseLog',
    SessionExerciseLog: 'SessionExerciseLog',
    exercise_analytics_view: 'exercise_analytics_view'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "feedback" | "exercise" | "programme" | "programmeActivityLog" | "workout" | "workoutSession" | "exerciseWithMetadata" | "exerciseLog" | "sessionExerciseLog" | "exercise_analytics_view"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Feedback: {
        payload: Prisma.$FeedbackPayload<ExtArgs>
        fields: Prisma.FeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findFirst: {
            args: Prisma.FeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findMany: {
            args: Prisma.FeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          create: {
            args: Prisma.FeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          createMany: {
            args: Prisma.FeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          delete: {
            args: Prisma.FeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          update: {
            args: Prisma.FeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          deleteMany: {
            args: Prisma.FeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FeedbackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          upsert: {
            args: Prisma.FeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          aggregate: {
            args: Prisma.FeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeedback>
          }
          groupBy: {
            args: Prisma.FeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<FeedbackCountAggregateOutputType> | number
          }
        }
      }
      Exercise: {
        payload: Prisma.$ExercisePayload<ExtArgs>
        fields: Prisma.ExerciseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExerciseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExerciseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          findFirst: {
            args: Prisma.ExerciseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExerciseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          findMany: {
            args: Prisma.ExerciseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>[]
          }
          create: {
            args: Prisma.ExerciseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          createMany: {
            args: Prisma.ExerciseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExerciseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>[]
          }
          delete: {
            args: Prisma.ExerciseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          update: {
            args: Prisma.ExerciseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          deleteMany: {
            args: Prisma.ExerciseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExerciseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExerciseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>[]
          }
          upsert: {
            args: Prisma.ExerciseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExercisePayload>
          }
          aggregate: {
            args: Prisma.ExerciseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExercise>
          }
          groupBy: {
            args: Prisma.ExerciseGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExerciseGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExerciseCountArgs<ExtArgs>
            result: $Utils.Optional<ExerciseCountAggregateOutputType> | number
          }
        }
      }
      Programme: {
        payload: Prisma.$ProgrammePayload<ExtArgs>
        fields: Prisma.ProgrammeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgrammeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgrammeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload>
          }
          findFirst: {
            args: Prisma.ProgrammeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgrammeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload>
          }
          findMany: {
            args: Prisma.ProgrammeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload>[]
          }
          create: {
            args: Prisma.ProgrammeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload>
          }
          createMany: {
            args: Prisma.ProgrammeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgrammeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload>[]
          }
          delete: {
            args: Prisma.ProgrammeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload>
          }
          update: {
            args: Prisma.ProgrammeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload>
          }
          deleteMany: {
            args: Prisma.ProgrammeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgrammeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProgrammeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload>[]
          }
          upsert: {
            args: Prisma.ProgrammeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammePayload>
          }
          aggregate: {
            args: Prisma.ProgrammeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgramme>
          }
          groupBy: {
            args: Prisma.ProgrammeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgrammeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgrammeCountArgs<ExtArgs>
            result: $Utils.Optional<ProgrammeCountAggregateOutputType> | number
          }
        }
      }
      ProgrammeActivityLog: {
        payload: Prisma.$ProgrammeActivityLogPayload<ExtArgs>
        fields: Prisma.ProgrammeActivityLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProgrammeActivityLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProgrammeActivityLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload>
          }
          findFirst: {
            args: Prisma.ProgrammeActivityLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProgrammeActivityLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload>
          }
          findMany: {
            args: Prisma.ProgrammeActivityLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload>[]
          }
          create: {
            args: Prisma.ProgrammeActivityLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload>
          }
          createMany: {
            args: Prisma.ProgrammeActivityLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProgrammeActivityLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload>[]
          }
          delete: {
            args: Prisma.ProgrammeActivityLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload>
          }
          update: {
            args: Prisma.ProgrammeActivityLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload>
          }
          deleteMany: {
            args: Prisma.ProgrammeActivityLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProgrammeActivityLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProgrammeActivityLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload>[]
          }
          upsert: {
            args: Prisma.ProgrammeActivityLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProgrammeActivityLogPayload>
          }
          aggregate: {
            args: Prisma.ProgrammeActivityLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProgrammeActivityLog>
          }
          groupBy: {
            args: Prisma.ProgrammeActivityLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProgrammeActivityLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProgrammeActivityLogCountArgs<ExtArgs>
            result: $Utils.Optional<ProgrammeActivityLogCountAggregateOutputType> | number
          }
        }
      }
      Workout: {
        payload: Prisma.$WorkoutPayload<ExtArgs>
        fields: Prisma.WorkoutFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkoutFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkoutFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload>
          }
          findFirst: {
            args: Prisma.WorkoutFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkoutFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload>
          }
          findMany: {
            args: Prisma.WorkoutFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload>[]
          }
          create: {
            args: Prisma.WorkoutCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload>
          }
          createMany: {
            args: Prisma.WorkoutCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkoutCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload>[]
          }
          delete: {
            args: Prisma.WorkoutDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload>
          }
          update: {
            args: Prisma.WorkoutUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload>
          }
          deleteMany: {
            args: Prisma.WorkoutDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkoutUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkoutUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload>[]
          }
          upsert: {
            args: Prisma.WorkoutUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutPayload>
          }
          aggregate: {
            args: Prisma.WorkoutAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkout>
          }
          groupBy: {
            args: Prisma.WorkoutGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkoutGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkoutCountArgs<ExtArgs>
            result: $Utils.Optional<WorkoutCountAggregateOutputType> | number
          }
        }
      }
      WorkoutSession: {
        payload: Prisma.$WorkoutSessionPayload<ExtArgs>
        fields: Prisma.WorkoutSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkoutSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkoutSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload>
          }
          findFirst: {
            args: Prisma.WorkoutSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkoutSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload>
          }
          findMany: {
            args: Prisma.WorkoutSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload>[]
          }
          create: {
            args: Prisma.WorkoutSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload>
          }
          createMany: {
            args: Prisma.WorkoutSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkoutSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload>[]
          }
          delete: {
            args: Prisma.WorkoutSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload>
          }
          update: {
            args: Prisma.WorkoutSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload>
          }
          deleteMany: {
            args: Prisma.WorkoutSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkoutSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkoutSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload>[]
          }
          upsert: {
            args: Prisma.WorkoutSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkoutSessionPayload>
          }
          aggregate: {
            args: Prisma.WorkoutSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkoutSession>
          }
          groupBy: {
            args: Prisma.WorkoutSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkoutSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkoutSessionCountArgs<ExtArgs>
            result: $Utils.Optional<WorkoutSessionCountAggregateOutputType> | number
          }
        }
      }
      ExerciseWithMetadata: {
        payload: Prisma.$ExerciseWithMetadataPayload<ExtArgs>
        fields: Prisma.ExerciseWithMetadataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExerciseWithMetadataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExerciseWithMetadataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload>
          }
          findFirst: {
            args: Prisma.ExerciseWithMetadataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExerciseWithMetadataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload>
          }
          findMany: {
            args: Prisma.ExerciseWithMetadataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload>[]
          }
          create: {
            args: Prisma.ExerciseWithMetadataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload>
          }
          createMany: {
            args: Prisma.ExerciseWithMetadataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExerciseWithMetadataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload>[]
          }
          delete: {
            args: Prisma.ExerciseWithMetadataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload>
          }
          update: {
            args: Prisma.ExerciseWithMetadataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload>
          }
          deleteMany: {
            args: Prisma.ExerciseWithMetadataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExerciseWithMetadataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExerciseWithMetadataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload>[]
          }
          upsert: {
            args: Prisma.ExerciseWithMetadataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseWithMetadataPayload>
          }
          aggregate: {
            args: Prisma.ExerciseWithMetadataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExerciseWithMetadata>
          }
          groupBy: {
            args: Prisma.ExerciseWithMetadataGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExerciseWithMetadataGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExerciseWithMetadataCountArgs<ExtArgs>
            result: $Utils.Optional<ExerciseWithMetadataCountAggregateOutputType> | number
          }
        }
      }
      ExerciseLog: {
        payload: Prisma.$ExerciseLogPayload<ExtArgs>
        fields: Prisma.ExerciseLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExerciseLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExerciseLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload>
          }
          findFirst: {
            args: Prisma.ExerciseLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExerciseLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload>
          }
          findMany: {
            args: Prisma.ExerciseLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload>[]
          }
          create: {
            args: Prisma.ExerciseLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload>
          }
          createMany: {
            args: Prisma.ExerciseLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExerciseLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload>[]
          }
          delete: {
            args: Prisma.ExerciseLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload>
          }
          update: {
            args: Prisma.ExerciseLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload>
          }
          deleteMany: {
            args: Prisma.ExerciseLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExerciseLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExerciseLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload>[]
          }
          upsert: {
            args: Prisma.ExerciseLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExerciseLogPayload>
          }
          aggregate: {
            args: Prisma.ExerciseLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExerciseLog>
          }
          groupBy: {
            args: Prisma.ExerciseLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExerciseLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExerciseLogCountArgs<ExtArgs>
            result: $Utils.Optional<ExerciseLogCountAggregateOutputType> | number
          }
        }
      }
      SessionExerciseLog: {
        payload: Prisma.$SessionExerciseLogPayload<ExtArgs>
        fields: Prisma.SessionExerciseLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionExerciseLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionExerciseLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload>
          }
          findFirst: {
            args: Prisma.SessionExerciseLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionExerciseLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload>
          }
          findMany: {
            args: Prisma.SessionExerciseLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload>[]
          }
          create: {
            args: Prisma.SessionExerciseLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload>
          }
          createMany: {
            args: Prisma.SessionExerciseLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionExerciseLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload>[]
          }
          delete: {
            args: Prisma.SessionExerciseLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload>
          }
          update: {
            args: Prisma.SessionExerciseLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload>
          }
          deleteMany: {
            args: Prisma.SessionExerciseLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionExerciseLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionExerciseLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload>[]
          }
          upsert: {
            args: Prisma.SessionExerciseLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionExerciseLogPayload>
          }
          aggregate: {
            args: Prisma.SessionExerciseLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSessionExerciseLog>
          }
          groupBy: {
            args: Prisma.SessionExerciseLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionExerciseLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionExerciseLogCountArgs<ExtArgs>
            result: $Utils.Optional<SessionExerciseLogCountAggregateOutputType> | number
          }
        }
      }
      exercise_analytics_view: {
        payload: Prisma.$exercise_analytics_viewPayload<ExtArgs>
        fields: Prisma.exercise_analytics_viewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.exercise_analytics_viewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exercise_analytics_viewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.exercise_analytics_viewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exercise_analytics_viewPayload>
          }
          findFirst: {
            args: Prisma.exercise_analytics_viewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exercise_analytics_viewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.exercise_analytics_viewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exercise_analytics_viewPayload>
          }
          findMany: {
            args: Prisma.exercise_analytics_viewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$exercise_analytics_viewPayload>[]
          }
          aggregate: {
            args: Prisma.Exercise_analytics_viewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExercise_analytics_view>
          }
          groupBy: {
            args: Prisma.exercise_analytics_viewGroupByArgs<ExtArgs>
            result: $Utils.Optional<Exercise_analytics_viewGroupByOutputType>[]
          }
          count: {
            args: Prisma.exercise_analytics_viewCountArgs<ExtArgs>
            result: $Utils.Optional<Exercise_analytics_viewCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    feedback?: FeedbackOmit
    exercise?: ExerciseOmit
    programme?: ProgrammeOmit
    programmeActivityLog?: ProgrammeActivityLogOmit
    workout?: WorkoutOmit
    workoutSession?: WorkoutSessionOmit
    exerciseWithMetadata?: ExerciseWithMetadataOmit
    exerciseLog?: ExerciseLogOmit
    sessionExerciseLog?: SessionExerciseLogOmit
    exercise_analytics_view?: exercise_analytics_viewOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    programmes: number
    exercises: number
    workoutSessions: number
    sessionExerciseLogs: number
    exerciseLogs: number
    feedbackEntries: number
    activityLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programmes?: boolean | UserCountOutputTypeCountProgrammesArgs
    exercises?: boolean | UserCountOutputTypeCountExercisesArgs
    workoutSessions?: boolean | UserCountOutputTypeCountWorkoutSessionsArgs
    sessionExerciseLogs?: boolean | UserCountOutputTypeCountSessionExerciseLogsArgs
    exerciseLogs?: boolean | UserCountOutputTypeCountExerciseLogsArgs
    feedbackEntries?: boolean | UserCountOutputTypeCountFeedbackEntriesArgs
    activityLogs?: boolean | UserCountOutputTypeCountActivityLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProgrammesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgrammeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExercisesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWorkoutSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkoutSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionExerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionExerciseLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFeedbackEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountActivityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgrammeActivityLogWhereInput
  }


  /**
   * Count Type ExerciseCountOutputType
   */

  export type ExerciseCountOutputType = {
    exercisesWithMetadata: number
    exerciseLogs: number
  }

  export type ExerciseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercisesWithMetadata?: boolean | ExerciseCountOutputTypeCountExercisesWithMetadataArgs
    exerciseLogs?: boolean | ExerciseCountOutputTypeCountExerciseLogsArgs
  }

  // Custom InputTypes
  /**
   * ExerciseCountOutputType without action
   */
  export type ExerciseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseCountOutputType
     */
    select?: ExerciseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExerciseCountOutputType without action
   */
  export type ExerciseCountOutputTypeCountExercisesWithMetadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseWithMetadataWhereInput
  }

  /**
   * ExerciseCountOutputType without action
   */
  export type ExerciseCountOutputTypeCountExerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseLogWhereInput
  }


  /**
   * Count Type ProgrammeCountOutputType
   */

  export type ProgrammeCountOutputType = {
    workouts: number
    activity_logs: number
  }

  export type ProgrammeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workouts?: boolean | ProgrammeCountOutputTypeCountWorkoutsArgs
    activity_logs?: boolean | ProgrammeCountOutputTypeCountActivity_logsArgs
  }

  // Custom InputTypes
  /**
   * ProgrammeCountOutputType without action
   */
  export type ProgrammeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeCountOutputType
     */
    select?: ProgrammeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProgrammeCountOutputType without action
   */
  export type ProgrammeCountOutputTypeCountWorkoutsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkoutWhereInput
  }

  /**
   * ProgrammeCountOutputType without action
   */
  export type ProgrammeCountOutputTypeCountActivity_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgrammeActivityLogWhereInput
  }


  /**
   * Count Type WorkoutCountOutputType
   */

  export type WorkoutCountOutputType = {
    exercisesWithMetadata: number
    workoutSessions: number
  }

  export type WorkoutCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercisesWithMetadata?: boolean | WorkoutCountOutputTypeCountExercisesWithMetadataArgs
    workoutSessions?: boolean | WorkoutCountOutputTypeCountWorkoutSessionsArgs
  }

  // Custom InputTypes
  /**
   * WorkoutCountOutputType without action
   */
  export type WorkoutCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutCountOutputType
     */
    select?: WorkoutCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkoutCountOutputType without action
   */
  export type WorkoutCountOutputTypeCountExercisesWithMetadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseWithMetadataWhereInput
  }

  /**
   * WorkoutCountOutputType without action
   */
  export type WorkoutCountOutputTypeCountWorkoutSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkoutSessionWhereInput
  }


  /**
   * Count Type WorkoutSessionCountOutputType
   */

  export type WorkoutSessionCountOutputType = {
    sessionExerciseLogs: number
  }

  export type WorkoutSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessionExerciseLogs?: boolean | WorkoutSessionCountOutputTypeCountSessionExerciseLogsArgs
  }

  // Custom InputTypes
  /**
   * WorkoutSessionCountOutputType without action
   */
  export type WorkoutSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSessionCountOutputType
     */
    select?: WorkoutSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkoutSessionCountOutputType without action
   */
  export type WorkoutSessionCountOutputTypeCountSessionExerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionExerciseLogWhereInput
  }


  /**
   * Count Type ExerciseWithMetadataCountOutputType
   */

  export type ExerciseWithMetadataCountOutputType = {
    sessionExerciseLogs: number
  }

  export type ExerciseWithMetadataCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessionExerciseLogs?: boolean | ExerciseWithMetadataCountOutputTypeCountSessionExerciseLogsArgs
  }

  // Custom InputTypes
  /**
   * ExerciseWithMetadataCountOutputType without action
   */
  export type ExerciseWithMetadataCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadataCountOutputType
     */
    select?: ExerciseWithMetadataCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExerciseWithMetadataCountOutputType without action
   */
  export type ExerciseWithMetadataCountOutputTypeCountSessionExerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionExerciseLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    password_hash: string | null
    created_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password_hash: string | null
    created_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password_hash: number
    created_at: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    created_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    created_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    created_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    password_hash: string
    created_at: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    created_at?: boolean
    programmes?: boolean | User$programmesArgs<ExtArgs>
    exercises?: boolean | User$exercisesArgs<ExtArgs>
    workoutSessions?: boolean | User$workoutSessionsArgs<ExtArgs>
    sessionExerciseLogs?: boolean | User$sessionExerciseLogsArgs<ExtArgs>
    exerciseLogs?: boolean | User$exerciseLogsArgs<ExtArgs>
    feedbackEntries?: boolean | User$feedbackEntriesArgs<ExtArgs>
    activityLogs?: boolean | User$activityLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    password_hash?: boolean
    created_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password_hash" | "created_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programmes?: boolean | User$programmesArgs<ExtArgs>
    exercises?: boolean | User$exercisesArgs<ExtArgs>
    workoutSessions?: boolean | User$workoutSessionsArgs<ExtArgs>
    sessionExerciseLogs?: boolean | User$sessionExerciseLogsArgs<ExtArgs>
    exerciseLogs?: boolean | User$exerciseLogsArgs<ExtArgs>
    feedbackEntries?: boolean | User$feedbackEntriesArgs<ExtArgs>
    activityLogs?: boolean | User$activityLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      programmes: Prisma.$ProgrammePayload<ExtArgs>[]
      exercises: Prisma.$ExercisePayload<ExtArgs>[]
      workoutSessions: Prisma.$WorkoutSessionPayload<ExtArgs>[]
      sessionExerciseLogs: Prisma.$SessionExerciseLogPayload<ExtArgs>[]
      exerciseLogs: Prisma.$ExerciseLogPayload<ExtArgs>[]
      feedbackEntries: Prisma.$FeedbackPayload<ExtArgs>[]
      activityLogs: Prisma.$ProgrammeActivityLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      password_hash: string
      created_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    programmes<T extends User$programmesArgs<ExtArgs> = {}>(args?: Subset<T, User$programmesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    exercises<T extends User$exercisesArgs<ExtArgs> = {}>(args?: Subset<T, User$exercisesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    workoutSessions<T extends User$workoutSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$workoutSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessionExerciseLogs<T extends User$sessionExerciseLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionExerciseLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    exerciseLogs<T extends User$exerciseLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$exerciseLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    feedbackEntries<T extends User$feedbackEntriesArgs<ExtArgs> = {}>(args?: Subset<T, User$feedbackEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    activityLogs<T extends User$activityLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$activityLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password_hash: FieldRef<"User", 'String'>
    readonly created_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.programmes
   */
  export type User$programmesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    where?: ProgrammeWhereInput
    orderBy?: ProgrammeOrderByWithRelationInput | ProgrammeOrderByWithRelationInput[]
    cursor?: ProgrammeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgrammeScalarFieldEnum | ProgrammeScalarFieldEnum[]
  }

  /**
   * User.exercises
   */
  export type User$exercisesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    where?: ExerciseWhereInput
    orderBy?: ExerciseOrderByWithRelationInput | ExerciseOrderByWithRelationInput[]
    cursor?: ExerciseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExerciseScalarFieldEnum | ExerciseScalarFieldEnum[]
  }

  /**
   * User.workoutSessions
   */
  export type User$workoutSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    where?: WorkoutSessionWhereInput
    orderBy?: WorkoutSessionOrderByWithRelationInput | WorkoutSessionOrderByWithRelationInput[]
    cursor?: WorkoutSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkoutSessionScalarFieldEnum | WorkoutSessionScalarFieldEnum[]
  }

  /**
   * User.sessionExerciseLogs
   */
  export type User$sessionExerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    where?: SessionExerciseLogWhereInput
    orderBy?: SessionExerciseLogOrderByWithRelationInput | SessionExerciseLogOrderByWithRelationInput[]
    cursor?: SessionExerciseLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionExerciseLogScalarFieldEnum | SessionExerciseLogScalarFieldEnum[]
  }

  /**
   * User.exerciseLogs
   */
  export type User$exerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    where?: ExerciseLogWhereInput
    orderBy?: ExerciseLogOrderByWithRelationInput | ExerciseLogOrderByWithRelationInput[]
    cursor?: ExerciseLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExerciseLogScalarFieldEnum | ExerciseLogScalarFieldEnum[]
  }

  /**
   * User.feedbackEntries
   */
  export type User$feedbackEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    cursor?: FeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * User.activityLogs
   */
  export type User$activityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    where?: ProgrammeActivityLogWhereInput
    orderBy?: ProgrammeActivityLogOrderByWithRelationInput | ProgrammeActivityLogOrderByWithRelationInput[]
    cursor?: ProgrammeActivityLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgrammeActivityLogScalarFieldEnum | ProgrammeActivityLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Feedback
   */

  export type AggregateFeedback = {
    _count: FeedbackCountAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  export type FeedbackMinAggregateOutputType = {
    id: string | null
    description: string | null
    status: $Enums.FeedbackStatus | null
    created_at: Date | null
    updated_at: Date | null
    user_id: string | null
  }

  export type FeedbackMaxAggregateOutputType = {
    id: string | null
    description: string | null
    status: $Enums.FeedbackStatus | null
    created_at: Date | null
    updated_at: Date | null
    user_id: string | null
  }

  export type FeedbackCountAggregateOutputType = {
    id: number
    description: number
    status: number
    created_at: number
    updated_at: number
    user_id: number
    _all: number
  }


  export type FeedbackMinAggregateInputType = {
    id?: true
    description?: true
    status?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type FeedbackMaxAggregateInputType = {
    id?: true
    description?: true
    status?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type FeedbackCountAggregateInputType = {
    id?: true
    description?: true
    status?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    _all?: true
  }

  export type FeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedback to aggregate.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Feedbacks
    **/
    _count?: true | FeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeedbackMaxAggregateInputType
  }

  export type GetFeedbackAggregateType<T extends FeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeedback[P]>
      : GetScalarType<T[P], AggregateFeedback[P]>
  }




  export type FeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithAggregationInput | FeedbackOrderByWithAggregationInput[]
    by: FeedbackScalarFieldEnum[] | FeedbackScalarFieldEnum
    having?: FeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeedbackCountAggregateInputType | true
    _min?: FeedbackMinAggregateInputType
    _max?: FeedbackMaxAggregateInputType
  }

  export type FeedbackGroupByOutputType = {
    id: string
    description: string
    status: $Enums.FeedbackStatus
    created_at: Date
    updated_at: Date
    user_id: string
    _count: FeedbackCountAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  type GetFeedbackGroupByPayload<T extends FeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
        }
      >
    >


  export type FeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    description?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    description?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    description?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectScalar = {
    id?: boolean
    description?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
  }

  export type FeedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "description" | "status" | "created_at" | "updated_at" | "user_id", ExtArgs["result"]["feedback"]>
  export type FeedbackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FeedbackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FeedbackIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Feedback"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      description: string
      status: $Enums.FeedbackStatus
      created_at: Date
      updated_at: Date
      user_id: string
    }, ExtArgs["result"]["feedback"]>
    composites: {}
  }

  type FeedbackGetPayload<S extends boolean | null | undefined | FeedbackDefaultArgs> = $Result.GetResult<Prisma.$FeedbackPayload, S>

  type FeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: FeedbackCountAggregateInputType | true
    }

  export interface FeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Feedback'], meta: { name: 'Feedback' } }
    /**
     * Find zero or one Feedback that matches the filter.
     * @param {FeedbackFindUniqueArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeedbackFindUniqueArgs>(args: SelectSubset<T, FeedbackFindUniqueArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FeedbackFindUniqueOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, FeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeedbackFindFirstArgs>(args?: SelectSubset<T, FeedbackFindFirstArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, FeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feedbacks
     * const feedbacks = await prisma.feedback.findMany()
     * 
     * // Get first 10 Feedbacks
     * const feedbacks = await prisma.feedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feedbackWithIdOnly = await prisma.feedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeedbackFindManyArgs>(args?: SelectSubset<T, FeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feedback.
     * @param {FeedbackCreateArgs} args - Arguments to create a Feedback.
     * @example
     * // Create one Feedback
     * const Feedback = await prisma.feedback.create({
     *   data: {
     *     // ... data to create a Feedback
     *   }
     * })
     * 
     */
    create<T extends FeedbackCreateArgs>(args: SelectSubset<T, FeedbackCreateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Feedbacks.
     * @param {FeedbackCreateManyArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeedbackCreateManyArgs>(args?: SelectSubset<T, FeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Feedbacks and returns the data saved in the database.
     * @param {FeedbackCreateManyAndReturnArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, FeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Feedback.
     * @param {FeedbackDeleteArgs} args - Arguments to delete one Feedback.
     * @example
     * // Delete one Feedback
     * const Feedback = await prisma.feedback.delete({
     *   where: {
     *     // ... filter to delete one Feedback
     *   }
     * })
     * 
     */
    delete<T extends FeedbackDeleteArgs>(args: SelectSubset<T, FeedbackDeleteArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feedback.
     * @param {FeedbackUpdateArgs} args - Arguments to update one Feedback.
     * @example
     * // Update one Feedback
     * const feedback = await prisma.feedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeedbackUpdateArgs>(args: SelectSubset<T, FeedbackUpdateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Feedbacks.
     * @param {FeedbackDeleteManyArgs} args - Arguments to filter Feedbacks to delete.
     * @example
     * // Delete a few Feedbacks
     * const { count } = await prisma.feedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeedbackDeleteManyArgs>(args?: SelectSubset<T, FeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeedbackUpdateManyArgs>(args: SelectSubset<T, FeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks and returns the data updated in the database.
     * @param {FeedbackUpdateManyAndReturnArgs} args - Arguments to update many Feedbacks.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FeedbackUpdateManyAndReturnArgs>(args: SelectSubset<T, FeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Feedback.
     * @param {FeedbackUpsertArgs} args - Arguments to update or create a Feedback.
     * @example
     * // Update or create a Feedback
     * const feedback = await prisma.feedback.upsert({
     *   create: {
     *     // ... data to create a Feedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feedback we want to update
     *   }
     * })
     */
    upsert<T extends FeedbackUpsertArgs>(args: SelectSubset<T, FeedbackUpsertArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackCountArgs} args - Arguments to filter Feedbacks to count.
     * @example
     * // Count the number of Feedbacks
     * const count = await prisma.feedback.count({
     *   where: {
     *     // ... the filter for the Feedbacks we want to count
     *   }
     * })
    **/
    count<T extends FeedbackCountArgs>(
      args?: Subset<T, FeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeedbackAggregateArgs>(args: Subset<T, FeedbackAggregateArgs>): Prisma.PrismaPromise<GetFeedbackAggregateType<T>>

    /**
     * Group by Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeedbackGroupByArgs['orderBy'] }
        : { orderBy?: FeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Feedback model
   */
  readonly fields: FeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Feedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Feedback model
   */
  interface FeedbackFieldRefs {
    readonly id: FieldRef<"Feedback", 'String'>
    readonly description: FieldRef<"Feedback", 'String'>
    readonly status: FieldRef<"Feedback", 'FeedbackStatus'>
    readonly created_at: FieldRef<"Feedback", 'DateTime'>
    readonly updated_at: FieldRef<"Feedback", 'DateTime'>
    readonly user_id: FieldRef<"Feedback", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Feedback findUnique
   */
  export type FeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Feedback findUniqueOrThrow
   */
  export type FeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Feedback findFirst
   */
  export type FeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Feedback findFirstOrThrow
   */
  export type FeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Feedback findMany
   */
  export type FeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedbacks to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Feedback create
   */
  export type FeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The data needed to create a Feedback.
     */
    data: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Feedback createMany
   */
  export type FeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feedback createManyAndReturn
   */
  export type FeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feedback update
   */
  export type FeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The data needed to update a Feedback.
     */
    data: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
    /**
     * Choose, which Feedback to update.
     */
    where: FeedbackWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Feedback updateMany
   */
  export type FeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
  }

  /**
   * Feedback updateManyAndReturn
   */
  export type FeedbackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feedback upsert
   */
  export type FeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The filter to search for the Feedback to update in case it exists.
     */
    where: FeedbackWhereUniqueInput
    /**
     * In case the Feedback found by the `where` argument doesn't exist, create a new Feedback with this data.
     */
    create: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
    /**
     * In case the Feedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Feedback delete
   */
  export type FeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter which Feedback to delete.
     */
    where: FeedbackWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Feedback deleteMany
   */
  export type FeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedbacks to delete
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to delete.
     */
    limit?: number
  }

  /**
   * Feedback without action
   */
  export type FeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
  }


  /**
   * Model Exercise
   */

  export type AggregateExercise = {
    _count: ExerciseCountAggregateOutputType | null
    _min: ExerciseMinAggregateOutputType | null
    _max: ExerciseMaxAggregateOutputType | null
  }

  export type ExerciseMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    muscle_group: $Enums.MuscleGroup | null
    is_global: boolean | null
    user_id: string | null
  }

  export type ExerciseMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    muscle_group: $Enums.MuscleGroup | null
    is_global: boolean | null
    user_id: string | null
  }

  export type ExerciseCountAggregateOutputType = {
    id: number
    name: number
    description: number
    muscle_group: number
    is_global: number
    user_id: number
    _all: number
  }


  export type ExerciseMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    muscle_group?: true
    is_global?: true
    user_id?: true
  }

  export type ExerciseMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    muscle_group?: true
    is_global?: true
    user_id?: true
  }

  export type ExerciseCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    muscle_group?: true
    is_global?: true
    user_id?: true
    _all?: true
  }

  export type ExerciseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exercise to aggregate.
     */
    where?: ExerciseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exercises to fetch.
     */
    orderBy?: ExerciseOrderByWithRelationInput | ExerciseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExerciseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exercises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exercises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Exercises
    **/
    _count?: true | ExerciseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExerciseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExerciseMaxAggregateInputType
  }

  export type GetExerciseAggregateType<T extends ExerciseAggregateArgs> = {
        [P in keyof T & keyof AggregateExercise]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExercise[P]>
      : GetScalarType<T[P], AggregateExercise[P]>
  }




  export type ExerciseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseWhereInput
    orderBy?: ExerciseOrderByWithAggregationInput | ExerciseOrderByWithAggregationInput[]
    by: ExerciseScalarFieldEnum[] | ExerciseScalarFieldEnum
    having?: ExerciseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExerciseCountAggregateInputType | true
    _min?: ExerciseMinAggregateInputType
    _max?: ExerciseMaxAggregateInputType
  }

  export type ExerciseGroupByOutputType = {
    id: string
    name: string
    description: string | null
    muscle_group: $Enums.MuscleGroup
    is_global: boolean
    user_id: string | null
    _count: ExerciseCountAggregateOutputType | null
    _min: ExerciseMinAggregateOutputType | null
    _max: ExerciseMaxAggregateOutputType | null
  }

  type GetExerciseGroupByPayload<T extends ExerciseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExerciseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExerciseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExerciseGroupByOutputType[P]>
            : GetScalarType<T[P], ExerciseGroupByOutputType[P]>
        }
      >
    >


  export type ExerciseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    muscle_group?: boolean
    is_global?: boolean
    user_id?: boolean
    user?: boolean | Exercise$userArgs<ExtArgs>
    exercisesWithMetadata?: boolean | Exercise$exercisesWithMetadataArgs<ExtArgs>
    exerciseLogs?: boolean | Exercise$exerciseLogsArgs<ExtArgs>
    _count?: boolean | ExerciseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exercise"]>

  export type ExerciseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    muscle_group?: boolean
    is_global?: boolean
    user_id?: boolean
    user?: boolean | Exercise$userArgs<ExtArgs>
  }, ExtArgs["result"]["exercise"]>

  export type ExerciseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    muscle_group?: boolean
    is_global?: boolean
    user_id?: boolean
    user?: boolean | Exercise$userArgs<ExtArgs>
  }, ExtArgs["result"]["exercise"]>

  export type ExerciseSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    muscle_group?: boolean
    is_global?: boolean
    user_id?: boolean
  }

  export type ExerciseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "muscle_group" | "is_global" | "user_id", ExtArgs["result"]["exercise"]>
  export type ExerciseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Exercise$userArgs<ExtArgs>
    exercisesWithMetadata?: boolean | Exercise$exercisesWithMetadataArgs<ExtArgs>
    exerciseLogs?: boolean | Exercise$exerciseLogsArgs<ExtArgs>
    _count?: boolean | ExerciseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExerciseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Exercise$userArgs<ExtArgs>
  }
  export type ExerciseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Exercise$userArgs<ExtArgs>
  }

  export type $ExercisePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Exercise"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      exercisesWithMetadata: Prisma.$ExerciseWithMetadataPayload<ExtArgs>[]
      exerciseLogs: Prisma.$ExerciseLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      muscle_group: $Enums.MuscleGroup
      is_global: boolean
      user_id: string | null
    }, ExtArgs["result"]["exercise"]>
    composites: {}
  }

  type ExerciseGetPayload<S extends boolean | null | undefined | ExerciseDefaultArgs> = $Result.GetResult<Prisma.$ExercisePayload, S>

  type ExerciseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExerciseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: ExerciseCountAggregateInputType | true
    }

  export interface ExerciseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Exercise'], meta: { name: 'Exercise' } }
    /**
     * Find zero or one Exercise that matches the filter.
     * @param {ExerciseFindUniqueArgs} args - Arguments to find a Exercise
     * @example
     * // Get one Exercise
     * const exercise = await prisma.exercise.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExerciseFindUniqueArgs>(args: SelectSubset<T, ExerciseFindUniqueArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Exercise that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExerciseFindUniqueOrThrowArgs} args - Arguments to find a Exercise
     * @example
     * // Get one Exercise
     * const exercise = await prisma.exercise.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExerciseFindUniqueOrThrowArgs>(args: SelectSubset<T, ExerciseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exercise that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseFindFirstArgs} args - Arguments to find a Exercise
     * @example
     * // Get one Exercise
     * const exercise = await prisma.exercise.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExerciseFindFirstArgs>(args?: SelectSubset<T, ExerciseFindFirstArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exercise that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseFindFirstOrThrowArgs} args - Arguments to find a Exercise
     * @example
     * // Get one Exercise
     * const exercise = await prisma.exercise.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExerciseFindFirstOrThrowArgs>(args?: SelectSubset<T, ExerciseFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Exercises that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Exercises
     * const exercises = await prisma.exercise.findMany()
     * 
     * // Get first 10 Exercises
     * const exercises = await prisma.exercise.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exerciseWithIdOnly = await prisma.exercise.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExerciseFindManyArgs>(args?: SelectSubset<T, ExerciseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Exercise.
     * @param {ExerciseCreateArgs} args - Arguments to create a Exercise.
     * @example
     * // Create one Exercise
     * const Exercise = await prisma.exercise.create({
     *   data: {
     *     // ... data to create a Exercise
     *   }
     * })
     * 
     */
    create<T extends ExerciseCreateArgs>(args: SelectSubset<T, ExerciseCreateArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Exercises.
     * @param {ExerciseCreateManyArgs} args - Arguments to create many Exercises.
     * @example
     * // Create many Exercises
     * const exercise = await prisma.exercise.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExerciseCreateManyArgs>(args?: SelectSubset<T, ExerciseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Exercises and returns the data saved in the database.
     * @param {ExerciseCreateManyAndReturnArgs} args - Arguments to create many Exercises.
     * @example
     * // Create many Exercises
     * const exercise = await prisma.exercise.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Exercises and only return the `id`
     * const exerciseWithIdOnly = await prisma.exercise.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExerciseCreateManyAndReturnArgs>(args?: SelectSubset<T, ExerciseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Exercise.
     * @param {ExerciseDeleteArgs} args - Arguments to delete one Exercise.
     * @example
     * // Delete one Exercise
     * const Exercise = await prisma.exercise.delete({
     *   where: {
     *     // ... filter to delete one Exercise
     *   }
     * })
     * 
     */
    delete<T extends ExerciseDeleteArgs>(args: SelectSubset<T, ExerciseDeleteArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Exercise.
     * @param {ExerciseUpdateArgs} args - Arguments to update one Exercise.
     * @example
     * // Update one Exercise
     * const exercise = await prisma.exercise.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExerciseUpdateArgs>(args: SelectSubset<T, ExerciseUpdateArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Exercises.
     * @param {ExerciseDeleteManyArgs} args - Arguments to filter Exercises to delete.
     * @example
     * // Delete a few Exercises
     * const { count } = await prisma.exercise.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExerciseDeleteManyArgs>(args?: SelectSubset<T, ExerciseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exercises.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Exercises
     * const exercise = await prisma.exercise.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExerciseUpdateManyArgs>(args: SelectSubset<T, ExerciseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Exercises and returns the data updated in the database.
     * @param {ExerciseUpdateManyAndReturnArgs} args - Arguments to update many Exercises.
     * @example
     * // Update many Exercises
     * const exercise = await prisma.exercise.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Exercises and only return the `id`
     * const exerciseWithIdOnly = await prisma.exercise.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExerciseUpdateManyAndReturnArgs>(args: SelectSubset<T, ExerciseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Exercise.
     * @param {ExerciseUpsertArgs} args - Arguments to update or create a Exercise.
     * @example
     * // Update or create a Exercise
     * const exercise = await prisma.exercise.upsert({
     *   create: {
     *     // ... data to create a Exercise
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Exercise we want to update
     *   }
     * })
     */
    upsert<T extends ExerciseUpsertArgs>(args: SelectSubset<T, ExerciseUpsertArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Exercises.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseCountArgs} args - Arguments to filter Exercises to count.
     * @example
     * // Count the number of Exercises
     * const count = await prisma.exercise.count({
     *   where: {
     *     // ... the filter for the Exercises we want to count
     *   }
     * })
    **/
    count<T extends ExerciseCountArgs>(
      args?: Subset<T, ExerciseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExerciseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Exercise.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExerciseAggregateArgs>(args: Subset<T, ExerciseAggregateArgs>): Prisma.PrismaPromise<GetExerciseAggregateType<T>>

    /**
     * Group by Exercise.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExerciseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExerciseGroupByArgs['orderBy'] }
        : { orderBy?: ExerciseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExerciseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExerciseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Exercise model
   */
  readonly fields: ExerciseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Exercise.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExerciseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Exercise$userArgs<ExtArgs> = {}>(args?: Subset<T, Exercise$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    exercisesWithMetadata<T extends Exercise$exercisesWithMetadataArgs<ExtArgs> = {}>(args?: Subset<T, Exercise$exercisesWithMetadataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    exerciseLogs<T extends Exercise$exerciseLogsArgs<ExtArgs> = {}>(args?: Subset<T, Exercise$exerciseLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Exercise model
   */
  interface ExerciseFieldRefs {
    readonly id: FieldRef<"Exercise", 'String'>
    readonly name: FieldRef<"Exercise", 'String'>
    readonly description: FieldRef<"Exercise", 'String'>
    readonly muscle_group: FieldRef<"Exercise", 'MuscleGroup'>
    readonly is_global: FieldRef<"Exercise", 'Boolean'>
    readonly user_id: FieldRef<"Exercise", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Exercise findUnique
   */
  export type ExerciseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercise to fetch.
     */
    where: ExerciseWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Exercise findUniqueOrThrow
   */
  export type ExerciseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercise to fetch.
     */
    where: ExerciseWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Exercise findFirst
   */
  export type ExerciseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercise to fetch.
     */
    where?: ExerciseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exercises to fetch.
     */
    orderBy?: ExerciseOrderByWithRelationInput | ExerciseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exercises.
     */
    cursor?: ExerciseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exercises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exercises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exercises.
     */
    distinct?: ExerciseScalarFieldEnum | ExerciseScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Exercise findFirstOrThrow
   */
  export type ExerciseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercise to fetch.
     */
    where?: ExerciseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exercises to fetch.
     */
    orderBy?: ExerciseOrderByWithRelationInput | ExerciseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Exercises.
     */
    cursor?: ExerciseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exercises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exercises.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Exercises.
     */
    distinct?: ExerciseScalarFieldEnum | ExerciseScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Exercise findMany
   */
  export type ExerciseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter, which Exercises to fetch.
     */
    where?: ExerciseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Exercises to fetch.
     */
    orderBy?: ExerciseOrderByWithRelationInput | ExerciseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Exercises.
     */
    cursor?: ExerciseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Exercises from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Exercises.
     */
    skip?: number
    distinct?: ExerciseScalarFieldEnum | ExerciseScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Exercise create
   */
  export type ExerciseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * The data needed to create a Exercise.
     */
    data: XOR<ExerciseCreateInput, ExerciseUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Exercise createMany
   */
  export type ExerciseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Exercises.
     */
    data: ExerciseCreateManyInput | ExerciseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Exercise createManyAndReturn
   */
  export type ExerciseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * The data used to create many Exercises.
     */
    data: ExerciseCreateManyInput | ExerciseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Exercise update
   */
  export type ExerciseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * The data needed to update a Exercise.
     */
    data: XOR<ExerciseUpdateInput, ExerciseUncheckedUpdateInput>
    /**
     * Choose, which Exercise to update.
     */
    where: ExerciseWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Exercise updateMany
   */
  export type ExerciseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Exercises.
     */
    data: XOR<ExerciseUpdateManyMutationInput, ExerciseUncheckedUpdateManyInput>
    /**
     * Filter which Exercises to update
     */
    where?: ExerciseWhereInput
    /**
     * Limit how many Exercises to update.
     */
    limit?: number
  }

  /**
   * Exercise updateManyAndReturn
   */
  export type ExerciseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * The data used to update Exercises.
     */
    data: XOR<ExerciseUpdateManyMutationInput, ExerciseUncheckedUpdateManyInput>
    /**
     * Filter which Exercises to update
     */
    where?: ExerciseWhereInput
    /**
     * Limit how many Exercises to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Exercise upsert
   */
  export type ExerciseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * The filter to search for the Exercise to update in case it exists.
     */
    where: ExerciseWhereUniqueInput
    /**
     * In case the Exercise found by the `where` argument doesn't exist, create a new Exercise with this data.
     */
    create: XOR<ExerciseCreateInput, ExerciseUncheckedCreateInput>
    /**
     * In case the Exercise was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExerciseUpdateInput, ExerciseUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Exercise delete
   */
  export type ExerciseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    /**
     * Filter which Exercise to delete.
     */
    where: ExerciseWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Exercise deleteMany
   */
  export type ExerciseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Exercises to delete
     */
    where?: ExerciseWhereInput
    /**
     * Limit how many Exercises to delete.
     */
    limit?: number
  }

  /**
   * Exercise.user
   */
  export type Exercise$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Exercise.exercisesWithMetadata
   */
  export type Exercise$exercisesWithMetadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    where?: ExerciseWithMetadataWhereInput
    orderBy?: ExerciseWithMetadataOrderByWithRelationInput | ExerciseWithMetadataOrderByWithRelationInput[]
    cursor?: ExerciseWithMetadataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExerciseWithMetadataScalarFieldEnum | ExerciseWithMetadataScalarFieldEnum[]
  }

  /**
   * Exercise.exerciseLogs
   */
  export type Exercise$exerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    where?: ExerciseLogWhereInput
    orderBy?: ExerciseLogOrderByWithRelationInput | ExerciseLogOrderByWithRelationInput[]
    cursor?: ExerciseLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExerciseLogScalarFieldEnum | ExerciseLogScalarFieldEnum[]
  }

  /**
   * Exercise without action
   */
  export type ExerciseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
  }


  /**
   * Model Programme
   */

  export type AggregateProgramme = {
    _count: ProgrammeCountAggregateOutputType | null
    _min: ProgrammeMinAggregateOutputType | null
    _max: ProgrammeMaxAggregateOutputType | null
  }

  export type ProgrammeMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    user_id: string | null
    is_active: boolean | null
  }

  export type ProgrammeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    user_id: string | null
    is_active: boolean | null
  }

  export type ProgrammeCountAggregateOutputType = {
    id: number
    name: number
    description: number
    user_id: number
    is_active: number
    _all: number
  }


  export type ProgrammeMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    user_id?: true
    is_active?: true
  }

  export type ProgrammeMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    user_id?: true
    is_active?: true
  }

  export type ProgrammeCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    user_id?: true
    is_active?: true
    _all?: true
  }

  export type ProgrammeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Programme to aggregate.
     */
    where?: ProgrammeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programmes to fetch.
     */
    orderBy?: ProgrammeOrderByWithRelationInput | ProgrammeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgrammeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programmes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programmes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Programmes
    **/
    _count?: true | ProgrammeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgrammeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgrammeMaxAggregateInputType
  }

  export type GetProgrammeAggregateType<T extends ProgrammeAggregateArgs> = {
        [P in keyof T & keyof AggregateProgramme]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgramme[P]>
      : GetScalarType<T[P], AggregateProgramme[P]>
  }




  export type ProgrammeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgrammeWhereInput
    orderBy?: ProgrammeOrderByWithAggregationInput | ProgrammeOrderByWithAggregationInput[]
    by: ProgrammeScalarFieldEnum[] | ProgrammeScalarFieldEnum
    having?: ProgrammeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgrammeCountAggregateInputType | true
    _min?: ProgrammeMinAggregateInputType
    _max?: ProgrammeMaxAggregateInputType
  }

  export type ProgrammeGroupByOutputType = {
    id: string
    name: string
    description: string | null
    user_id: string
    is_active: boolean
    _count: ProgrammeCountAggregateOutputType | null
    _min: ProgrammeMinAggregateOutputType | null
    _max: ProgrammeMaxAggregateOutputType | null
  }

  type GetProgrammeGroupByPayload<T extends ProgrammeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgrammeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgrammeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgrammeGroupByOutputType[P]>
            : GetScalarType<T[P], ProgrammeGroupByOutputType[P]>
        }
      >
    >


  export type ProgrammeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    user_id?: boolean
    is_active?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    workouts?: boolean | Programme$workoutsArgs<ExtArgs>
    activity_logs?: boolean | Programme$activity_logsArgs<ExtArgs>
    _count?: boolean | ProgrammeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programme"]>

  export type ProgrammeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    user_id?: boolean
    is_active?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programme"]>

  export type ProgrammeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    user_id?: boolean
    is_active?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programme"]>

  export type ProgrammeSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    user_id?: boolean
    is_active?: boolean
  }

  export type ProgrammeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "user_id" | "is_active", ExtArgs["result"]["programme"]>
  export type ProgrammeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    workouts?: boolean | Programme$workoutsArgs<ExtArgs>
    activity_logs?: boolean | Programme$activity_logsArgs<ExtArgs>
    _count?: boolean | ProgrammeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProgrammeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProgrammeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProgrammePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Programme"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      workouts: Prisma.$WorkoutPayload<ExtArgs>[]
      activity_logs: Prisma.$ProgrammeActivityLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      user_id: string
      is_active: boolean
    }, ExtArgs["result"]["programme"]>
    composites: {}
  }

  type ProgrammeGetPayload<S extends boolean | null | undefined | ProgrammeDefaultArgs> = $Result.GetResult<Prisma.$ProgrammePayload, S>

  type ProgrammeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProgrammeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: ProgrammeCountAggregateInputType | true
    }

  export interface ProgrammeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Programme'], meta: { name: 'Programme' } }
    /**
     * Find zero or one Programme that matches the filter.
     * @param {ProgrammeFindUniqueArgs} args - Arguments to find a Programme
     * @example
     * // Get one Programme
     * const programme = await prisma.programme.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgrammeFindUniqueArgs>(args: SelectSubset<T, ProgrammeFindUniqueArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Programme that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProgrammeFindUniqueOrThrowArgs} args - Arguments to find a Programme
     * @example
     * // Get one Programme
     * const programme = await prisma.programme.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgrammeFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgrammeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Programme that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeFindFirstArgs} args - Arguments to find a Programme
     * @example
     * // Get one Programme
     * const programme = await prisma.programme.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgrammeFindFirstArgs>(args?: SelectSubset<T, ProgrammeFindFirstArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Programme that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeFindFirstOrThrowArgs} args - Arguments to find a Programme
     * @example
     * // Get one Programme
     * const programme = await prisma.programme.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgrammeFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgrammeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Programmes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Programmes
     * const programmes = await prisma.programme.findMany()
     * 
     * // Get first 10 Programmes
     * const programmes = await prisma.programme.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const programmeWithIdOnly = await prisma.programme.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgrammeFindManyArgs>(args?: SelectSubset<T, ProgrammeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Programme.
     * @param {ProgrammeCreateArgs} args - Arguments to create a Programme.
     * @example
     * // Create one Programme
     * const Programme = await prisma.programme.create({
     *   data: {
     *     // ... data to create a Programme
     *   }
     * })
     * 
     */
    create<T extends ProgrammeCreateArgs>(args: SelectSubset<T, ProgrammeCreateArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Programmes.
     * @param {ProgrammeCreateManyArgs} args - Arguments to create many Programmes.
     * @example
     * // Create many Programmes
     * const programme = await prisma.programme.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgrammeCreateManyArgs>(args?: SelectSubset<T, ProgrammeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Programmes and returns the data saved in the database.
     * @param {ProgrammeCreateManyAndReturnArgs} args - Arguments to create many Programmes.
     * @example
     * // Create many Programmes
     * const programme = await prisma.programme.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Programmes and only return the `id`
     * const programmeWithIdOnly = await prisma.programme.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgrammeCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgrammeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Programme.
     * @param {ProgrammeDeleteArgs} args - Arguments to delete one Programme.
     * @example
     * // Delete one Programme
     * const Programme = await prisma.programme.delete({
     *   where: {
     *     // ... filter to delete one Programme
     *   }
     * })
     * 
     */
    delete<T extends ProgrammeDeleteArgs>(args: SelectSubset<T, ProgrammeDeleteArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Programme.
     * @param {ProgrammeUpdateArgs} args - Arguments to update one Programme.
     * @example
     * // Update one Programme
     * const programme = await prisma.programme.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgrammeUpdateArgs>(args: SelectSubset<T, ProgrammeUpdateArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Programmes.
     * @param {ProgrammeDeleteManyArgs} args - Arguments to filter Programmes to delete.
     * @example
     * // Delete a few Programmes
     * const { count } = await prisma.programme.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgrammeDeleteManyArgs>(args?: SelectSubset<T, ProgrammeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Programmes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Programmes
     * const programme = await prisma.programme.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgrammeUpdateManyArgs>(args: SelectSubset<T, ProgrammeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Programmes and returns the data updated in the database.
     * @param {ProgrammeUpdateManyAndReturnArgs} args - Arguments to update many Programmes.
     * @example
     * // Update many Programmes
     * const programme = await prisma.programme.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Programmes and only return the `id`
     * const programmeWithIdOnly = await prisma.programme.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProgrammeUpdateManyAndReturnArgs>(args: SelectSubset<T, ProgrammeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Programme.
     * @param {ProgrammeUpsertArgs} args - Arguments to update or create a Programme.
     * @example
     * // Update or create a Programme
     * const programme = await prisma.programme.upsert({
     *   create: {
     *     // ... data to create a Programme
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Programme we want to update
     *   }
     * })
     */
    upsert<T extends ProgrammeUpsertArgs>(args: SelectSubset<T, ProgrammeUpsertArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Programmes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeCountArgs} args - Arguments to filter Programmes to count.
     * @example
     * // Count the number of Programmes
     * const count = await prisma.programme.count({
     *   where: {
     *     // ... the filter for the Programmes we want to count
     *   }
     * })
    **/
    count<T extends ProgrammeCountArgs>(
      args?: Subset<T, ProgrammeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgrammeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Programme.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProgrammeAggregateArgs>(args: Subset<T, ProgrammeAggregateArgs>): Prisma.PrismaPromise<GetProgrammeAggregateType<T>>

    /**
     * Group by Programme.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProgrammeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgrammeGroupByArgs['orderBy'] }
        : { orderBy?: ProgrammeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProgrammeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgrammeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Programme model
   */
  readonly fields: ProgrammeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Programme.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgrammeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    workouts<T extends Programme$workoutsArgs<ExtArgs> = {}>(args?: Subset<T, Programme$workoutsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    activity_logs<T extends Programme$activity_logsArgs<ExtArgs> = {}>(args?: Subset<T, Programme$activity_logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Programme model
   */
  interface ProgrammeFieldRefs {
    readonly id: FieldRef<"Programme", 'String'>
    readonly name: FieldRef<"Programme", 'String'>
    readonly description: FieldRef<"Programme", 'String'>
    readonly user_id: FieldRef<"Programme", 'String'>
    readonly is_active: FieldRef<"Programme", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Programme findUnique
   */
  export type ProgrammeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    /**
     * Filter, which Programme to fetch.
     */
    where: ProgrammeWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Programme findUniqueOrThrow
   */
  export type ProgrammeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    /**
     * Filter, which Programme to fetch.
     */
    where: ProgrammeWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Programme findFirst
   */
  export type ProgrammeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    /**
     * Filter, which Programme to fetch.
     */
    where?: ProgrammeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programmes to fetch.
     */
    orderBy?: ProgrammeOrderByWithRelationInput | ProgrammeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Programmes.
     */
    cursor?: ProgrammeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programmes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programmes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Programmes.
     */
    distinct?: ProgrammeScalarFieldEnum | ProgrammeScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Programme findFirstOrThrow
   */
  export type ProgrammeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    /**
     * Filter, which Programme to fetch.
     */
    where?: ProgrammeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programmes to fetch.
     */
    orderBy?: ProgrammeOrderByWithRelationInput | ProgrammeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Programmes.
     */
    cursor?: ProgrammeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programmes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programmes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Programmes.
     */
    distinct?: ProgrammeScalarFieldEnum | ProgrammeScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Programme findMany
   */
  export type ProgrammeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    /**
     * Filter, which Programmes to fetch.
     */
    where?: ProgrammeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Programmes to fetch.
     */
    orderBy?: ProgrammeOrderByWithRelationInput | ProgrammeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Programmes.
     */
    cursor?: ProgrammeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Programmes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Programmes.
     */
    skip?: number
    distinct?: ProgrammeScalarFieldEnum | ProgrammeScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Programme create
   */
  export type ProgrammeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    /**
     * The data needed to create a Programme.
     */
    data: XOR<ProgrammeCreateInput, ProgrammeUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Programme createMany
   */
  export type ProgrammeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Programmes.
     */
    data: ProgrammeCreateManyInput | ProgrammeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Programme createManyAndReturn
   */
  export type ProgrammeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * The data used to create many Programmes.
     */
    data: ProgrammeCreateManyInput | ProgrammeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Programme update
   */
  export type ProgrammeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    /**
     * The data needed to update a Programme.
     */
    data: XOR<ProgrammeUpdateInput, ProgrammeUncheckedUpdateInput>
    /**
     * Choose, which Programme to update.
     */
    where: ProgrammeWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Programme updateMany
   */
  export type ProgrammeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Programmes.
     */
    data: XOR<ProgrammeUpdateManyMutationInput, ProgrammeUncheckedUpdateManyInput>
    /**
     * Filter which Programmes to update
     */
    where?: ProgrammeWhereInput
    /**
     * Limit how many Programmes to update.
     */
    limit?: number
  }

  /**
   * Programme updateManyAndReturn
   */
  export type ProgrammeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * The data used to update Programmes.
     */
    data: XOR<ProgrammeUpdateManyMutationInput, ProgrammeUncheckedUpdateManyInput>
    /**
     * Filter which Programmes to update
     */
    where?: ProgrammeWhereInput
    /**
     * Limit how many Programmes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Programme upsert
   */
  export type ProgrammeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    /**
     * The filter to search for the Programme to update in case it exists.
     */
    where: ProgrammeWhereUniqueInput
    /**
     * In case the Programme found by the `where` argument doesn't exist, create a new Programme with this data.
     */
    create: XOR<ProgrammeCreateInput, ProgrammeUncheckedCreateInput>
    /**
     * In case the Programme was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgrammeUpdateInput, ProgrammeUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Programme delete
   */
  export type ProgrammeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
    /**
     * Filter which Programme to delete.
     */
    where: ProgrammeWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Programme deleteMany
   */
  export type ProgrammeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Programmes to delete
     */
    where?: ProgrammeWhereInput
    /**
     * Limit how many Programmes to delete.
     */
    limit?: number
  }

  /**
   * Programme.workouts
   */
  export type Programme$workoutsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    where?: WorkoutWhereInput
    orderBy?: WorkoutOrderByWithRelationInput | WorkoutOrderByWithRelationInput[]
    cursor?: WorkoutWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkoutScalarFieldEnum | WorkoutScalarFieldEnum[]
  }

  /**
   * Programme.activity_logs
   */
  export type Programme$activity_logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    where?: ProgrammeActivityLogWhereInput
    orderBy?: ProgrammeActivityLogOrderByWithRelationInput | ProgrammeActivityLogOrderByWithRelationInput[]
    cursor?: ProgrammeActivityLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProgrammeActivityLogScalarFieldEnum | ProgrammeActivityLogScalarFieldEnum[]
  }

  /**
   * Programme without action
   */
  export type ProgrammeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Programme
     */
    select?: ProgrammeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Programme
     */
    omit?: ProgrammeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeInclude<ExtArgs> | null
  }


  /**
   * Model ProgrammeActivityLog
   */

  export type AggregateProgrammeActivityLog = {
    _count: ProgrammeActivityLogCountAggregateOutputType | null
    _min: ProgrammeActivityLogMinAggregateOutputType | null
    _max: ProgrammeActivityLogMaxAggregateOutputType | null
  }

  export type ProgrammeActivityLogMinAggregateOutputType = {
    id: string | null
    start_time: Date | null
    end_time: Date | null
    programme_id: string | null
    user_id: string | null
  }

  export type ProgrammeActivityLogMaxAggregateOutputType = {
    id: string | null
    start_time: Date | null
    end_time: Date | null
    programme_id: string | null
    user_id: string | null
  }

  export type ProgrammeActivityLogCountAggregateOutputType = {
    id: number
    start_time: number
    end_time: number
    programme_id: number
    user_id: number
    _all: number
  }


  export type ProgrammeActivityLogMinAggregateInputType = {
    id?: true
    start_time?: true
    end_time?: true
    programme_id?: true
    user_id?: true
  }

  export type ProgrammeActivityLogMaxAggregateInputType = {
    id?: true
    start_time?: true
    end_time?: true
    programme_id?: true
    user_id?: true
  }

  export type ProgrammeActivityLogCountAggregateInputType = {
    id?: true
    start_time?: true
    end_time?: true
    programme_id?: true
    user_id?: true
    _all?: true
  }

  export type ProgrammeActivityLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgrammeActivityLog to aggregate.
     */
    where?: ProgrammeActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgrammeActivityLogs to fetch.
     */
    orderBy?: ProgrammeActivityLogOrderByWithRelationInput | ProgrammeActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProgrammeActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgrammeActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgrammeActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProgrammeActivityLogs
    **/
    _count?: true | ProgrammeActivityLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProgrammeActivityLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProgrammeActivityLogMaxAggregateInputType
  }

  export type GetProgrammeActivityLogAggregateType<T extends ProgrammeActivityLogAggregateArgs> = {
        [P in keyof T & keyof AggregateProgrammeActivityLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProgrammeActivityLog[P]>
      : GetScalarType<T[P], AggregateProgrammeActivityLog[P]>
  }




  export type ProgrammeActivityLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProgrammeActivityLogWhereInput
    orderBy?: ProgrammeActivityLogOrderByWithAggregationInput | ProgrammeActivityLogOrderByWithAggregationInput[]
    by: ProgrammeActivityLogScalarFieldEnum[] | ProgrammeActivityLogScalarFieldEnum
    having?: ProgrammeActivityLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProgrammeActivityLogCountAggregateInputType | true
    _min?: ProgrammeActivityLogMinAggregateInputType
    _max?: ProgrammeActivityLogMaxAggregateInputType
  }

  export type ProgrammeActivityLogGroupByOutputType = {
    id: string
    start_time: Date
    end_time: Date | null
    programme_id: string
    user_id: string
    _count: ProgrammeActivityLogCountAggregateOutputType | null
    _min: ProgrammeActivityLogMinAggregateOutputType | null
    _max: ProgrammeActivityLogMaxAggregateOutputType | null
  }

  type GetProgrammeActivityLogGroupByPayload<T extends ProgrammeActivityLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProgrammeActivityLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProgrammeActivityLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProgrammeActivityLogGroupByOutputType[P]>
            : GetScalarType<T[P], ProgrammeActivityLogGroupByOutputType[P]>
        }
      >
    >


  export type ProgrammeActivityLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start_time?: boolean
    end_time?: boolean
    programme_id?: boolean
    user_id?: boolean
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programmeActivityLog"]>

  export type ProgrammeActivityLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start_time?: boolean
    end_time?: boolean
    programme_id?: boolean
    user_id?: boolean
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programmeActivityLog"]>

  export type ProgrammeActivityLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start_time?: boolean
    end_time?: boolean
    programme_id?: boolean
    user_id?: boolean
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["programmeActivityLog"]>

  export type ProgrammeActivityLogSelectScalar = {
    id?: boolean
    start_time?: boolean
    end_time?: boolean
    programme_id?: boolean
    user_id?: boolean
  }

  export type ProgrammeActivityLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "start_time" | "end_time" | "programme_id" | "user_id", ExtArgs["result"]["programmeActivityLog"]>
  export type ProgrammeActivityLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProgrammeActivityLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProgrammeActivityLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProgrammeActivityLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProgrammeActivityLog"
    objects: {
      programme: Prisma.$ProgrammePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      start_time: Date
      end_time: Date | null
      programme_id: string
      user_id: string
    }, ExtArgs["result"]["programmeActivityLog"]>
    composites: {}
  }

  type ProgrammeActivityLogGetPayload<S extends boolean | null | undefined | ProgrammeActivityLogDefaultArgs> = $Result.GetResult<Prisma.$ProgrammeActivityLogPayload, S>

  type ProgrammeActivityLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProgrammeActivityLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: ProgrammeActivityLogCountAggregateInputType | true
    }

  export interface ProgrammeActivityLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProgrammeActivityLog'], meta: { name: 'ProgrammeActivityLog' } }
    /**
     * Find zero or one ProgrammeActivityLog that matches the filter.
     * @param {ProgrammeActivityLogFindUniqueArgs} args - Arguments to find a ProgrammeActivityLog
     * @example
     * // Get one ProgrammeActivityLog
     * const programmeActivityLog = await prisma.programmeActivityLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProgrammeActivityLogFindUniqueArgs>(args: SelectSubset<T, ProgrammeActivityLogFindUniqueArgs<ExtArgs>>): Prisma__ProgrammeActivityLogClient<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProgrammeActivityLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProgrammeActivityLogFindUniqueOrThrowArgs} args - Arguments to find a ProgrammeActivityLog
     * @example
     * // Get one ProgrammeActivityLog
     * const programmeActivityLog = await prisma.programmeActivityLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProgrammeActivityLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ProgrammeActivityLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProgrammeActivityLogClient<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProgrammeActivityLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeActivityLogFindFirstArgs} args - Arguments to find a ProgrammeActivityLog
     * @example
     * // Get one ProgrammeActivityLog
     * const programmeActivityLog = await prisma.programmeActivityLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProgrammeActivityLogFindFirstArgs>(args?: SelectSubset<T, ProgrammeActivityLogFindFirstArgs<ExtArgs>>): Prisma__ProgrammeActivityLogClient<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProgrammeActivityLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeActivityLogFindFirstOrThrowArgs} args - Arguments to find a ProgrammeActivityLog
     * @example
     * // Get one ProgrammeActivityLog
     * const programmeActivityLog = await prisma.programmeActivityLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProgrammeActivityLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ProgrammeActivityLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProgrammeActivityLogClient<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProgrammeActivityLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeActivityLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProgrammeActivityLogs
     * const programmeActivityLogs = await prisma.programmeActivityLog.findMany()
     * 
     * // Get first 10 ProgrammeActivityLogs
     * const programmeActivityLogs = await prisma.programmeActivityLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const programmeActivityLogWithIdOnly = await prisma.programmeActivityLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProgrammeActivityLogFindManyArgs>(args?: SelectSubset<T, ProgrammeActivityLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProgrammeActivityLog.
     * @param {ProgrammeActivityLogCreateArgs} args - Arguments to create a ProgrammeActivityLog.
     * @example
     * // Create one ProgrammeActivityLog
     * const ProgrammeActivityLog = await prisma.programmeActivityLog.create({
     *   data: {
     *     // ... data to create a ProgrammeActivityLog
     *   }
     * })
     * 
     */
    create<T extends ProgrammeActivityLogCreateArgs>(args: SelectSubset<T, ProgrammeActivityLogCreateArgs<ExtArgs>>): Prisma__ProgrammeActivityLogClient<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProgrammeActivityLogs.
     * @param {ProgrammeActivityLogCreateManyArgs} args - Arguments to create many ProgrammeActivityLogs.
     * @example
     * // Create many ProgrammeActivityLogs
     * const programmeActivityLog = await prisma.programmeActivityLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProgrammeActivityLogCreateManyArgs>(args?: SelectSubset<T, ProgrammeActivityLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProgrammeActivityLogs and returns the data saved in the database.
     * @param {ProgrammeActivityLogCreateManyAndReturnArgs} args - Arguments to create many ProgrammeActivityLogs.
     * @example
     * // Create many ProgrammeActivityLogs
     * const programmeActivityLog = await prisma.programmeActivityLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProgrammeActivityLogs and only return the `id`
     * const programmeActivityLogWithIdOnly = await prisma.programmeActivityLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProgrammeActivityLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ProgrammeActivityLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProgrammeActivityLog.
     * @param {ProgrammeActivityLogDeleteArgs} args - Arguments to delete one ProgrammeActivityLog.
     * @example
     * // Delete one ProgrammeActivityLog
     * const ProgrammeActivityLog = await prisma.programmeActivityLog.delete({
     *   where: {
     *     // ... filter to delete one ProgrammeActivityLog
     *   }
     * })
     * 
     */
    delete<T extends ProgrammeActivityLogDeleteArgs>(args: SelectSubset<T, ProgrammeActivityLogDeleteArgs<ExtArgs>>): Prisma__ProgrammeActivityLogClient<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProgrammeActivityLog.
     * @param {ProgrammeActivityLogUpdateArgs} args - Arguments to update one ProgrammeActivityLog.
     * @example
     * // Update one ProgrammeActivityLog
     * const programmeActivityLog = await prisma.programmeActivityLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProgrammeActivityLogUpdateArgs>(args: SelectSubset<T, ProgrammeActivityLogUpdateArgs<ExtArgs>>): Prisma__ProgrammeActivityLogClient<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProgrammeActivityLogs.
     * @param {ProgrammeActivityLogDeleteManyArgs} args - Arguments to filter ProgrammeActivityLogs to delete.
     * @example
     * // Delete a few ProgrammeActivityLogs
     * const { count } = await prisma.programmeActivityLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProgrammeActivityLogDeleteManyArgs>(args?: SelectSubset<T, ProgrammeActivityLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProgrammeActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeActivityLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProgrammeActivityLogs
     * const programmeActivityLog = await prisma.programmeActivityLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProgrammeActivityLogUpdateManyArgs>(args: SelectSubset<T, ProgrammeActivityLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProgrammeActivityLogs and returns the data updated in the database.
     * @param {ProgrammeActivityLogUpdateManyAndReturnArgs} args - Arguments to update many ProgrammeActivityLogs.
     * @example
     * // Update many ProgrammeActivityLogs
     * const programmeActivityLog = await prisma.programmeActivityLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProgrammeActivityLogs and only return the `id`
     * const programmeActivityLogWithIdOnly = await prisma.programmeActivityLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProgrammeActivityLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ProgrammeActivityLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProgrammeActivityLog.
     * @param {ProgrammeActivityLogUpsertArgs} args - Arguments to update or create a ProgrammeActivityLog.
     * @example
     * // Update or create a ProgrammeActivityLog
     * const programmeActivityLog = await prisma.programmeActivityLog.upsert({
     *   create: {
     *     // ... data to create a ProgrammeActivityLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProgrammeActivityLog we want to update
     *   }
     * })
     */
    upsert<T extends ProgrammeActivityLogUpsertArgs>(args: SelectSubset<T, ProgrammeActivityLogUpsertArgs<ExtArgs>>): Prisma__ProgrammeActivityLogClient<$Result.GetResult<Prisma.$ProgrammeActivityLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProgrammeActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeActivityLogCountArgs} args - Arguments to filter ProgrammeActivityLogs to count.
     * @example
     * // Count the number of ProgrammeActivityLogs
     * const count = await prisma.programmeActivityLog.count({
     *   where: {
     *     // ... the filter for the ProgrammeActivityLogs we want to count
     *   }
     * })
    **/
    count<T extends ProgrammeActivityLogCountArgs>(
      args?: Subset<T, ProgrammeActivityLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProgrammeActivityLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProgrammeActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeActivityLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProgrammeActivityLogAggregateArgs>(args: Subset<T, ProgrammeActivityLogAggregateArgs>): Prisma.PrismaPromise<GetProgrammeActivityLogAggregateType<T>>

    /**
     * Group by ProgrammeActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProgrammeActivityLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProgrammeActivityLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProgrammeActivityLogGroupByArgs['orderBy'] }
        : { orderBy?: ProgrammeActivityLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProgrammeActivityLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProgrammeActivityLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProgrammeActivityLog model
   */
  readonly fields: ProgrammeActivityLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProgrammeActivityLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProgrammeActivityLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    programme<T extends ProgrammeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgrammeDefaultArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProgrammeActivityLog model
   */
  interface ProgrammeActivityLogFieldRefs {
    readonly id: FieldRef<"ProgrammeActivityLog", 'String'>
    readonly start_time: FieldRef<"ProgrammeActivityLog", 'DateTime'>
    readonly end_time: FieldRef<"ProgrammeActivityLog", 'DateTime'>
    readonly programme_id: FieldRef<"ProgrammeActivityLog", 'String'>
    readonly user_id: FieldRef<"ProgrammeActivityLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProgrammeActivityLog findUnique
   */
  export type ProgrammeActivityLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ProgrammeActivityLog to fetch.
     */
    where: ProgrammeActivityLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ProgrammeActivityLog findUniqueOrThrow
   */
  export type ProgrammeActivityLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ProgrammeActivityLog to fetch.
     */
    where: ProgrammeActivityLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ProgrammeActivityLog findFirst
   */
  export type ProgrammeActivityLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ProgrammeActivityLog to fetch.
     */
    where?: ProgrammeActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgrammeActivityLogs to fetch.
     */
    orderBy?: ProgrammeActivityLogOrderByWithRelationInput | ProgrammeActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgrammeActivityLogs.
     */
    cursor?: ProgrammeActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgrammeActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgrammeActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgrammeActivityLogs.
     */
    distinct?: ProgrammeActivityLogScalarFieldEnum | ProgrammeActivityLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ProgrammeActivityLog findFirstOrThrow
   */
  export type ProgrammeActivityLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ProgrammeActivityLog to fetch.
     */
    where?: ProgrammeActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgrammeActivityLogs to fetch.
     */
    orderBy?: ProgrammeActivityLogOrderByWithRelationInput | ProgrammeActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProgrammeActivityLogs.
     */
    cursor?: ProgrammeActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgrammeActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgrammeActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProgrammeActivityLogs.
     */
    distinct?: ProgrammeActivityLogScalarFieldEnum | ProgrammeActivityLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ProgrammeActivityLog findMany
   */
  export type ProgrammeActivityLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which ProgrammeActivityLogs to fetch.
     */
    where?: ProgrammeActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProgrammeActivityLogs to fetch.
     */
    orderBy?: ProgrammeActivityLogOrderByWithRelationInput | ProgrammeActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProgrammeActivityLogs.
     */
    cursor?: ProgrammeActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProgrammeActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProgrammeActivityLogs.
     */
    skip?: number
    distinct?: ProgrammeActivityLogScalarFieldEnum | ProgrammeActivityLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ProgrammeActivityLog create
   */
  export type ProgrammeActivityLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ProgrammeActivityLog.
     */
    data: XOR<ProgrammeActivityLogCreateInput, ProgrammeActivityLogUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ProgrammeActivityLog createMany
   */
  export type ProgrammeActivityLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProgrammeActivityLogs.
     */
    data: ProgrammeActivityLogCreateManyInput | ProgrammeActivityLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProgrammeActivityLog createManyAndReturn
   */
  export type ProgrammeActivityLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * The data used to create many ProgrammeActivityLogs.
     */
    data: ProgrammeActivityLogCreateManyInput | ProgrammeActivityLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProgrammeActivityLog update
   */
  export type ProgrammeActivityLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ProgrammeActivityLog.
     */
    data: XOR<ProgrammeActivityLogUpdateInput, ProgrammeActivityLogUncheckedUpdateInput>
    /**
     * Choose, which ProgrammeActivityLog to update.
     */
    where: ProgrammeActivityLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ProgrammeActivityLog updateMany
   */
  export type ProgrammeActivityLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProgrammeActivityLogs.
     */
    data: XOR<ProgrammeActivityLogUpdateManyMutationInput, ProgrammeActivityLogUncheckedUpdateManyInput>
    /**
     * Filter which ProgrammeActivityLogs to update
     */
    where?: ProgrammeActivityLogWhereInput
    /**
     * Limit how many ProgrammeActivityLogs to update.
     */
    limit?: number
  }

  /**
   * ProgrammeActivityLog updateManyAndReturn
   */
  export type ProgrammeActivityLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * The data used to update ProgrammeActivityLogs.
     */
    data: XOR<ProgrammeActivityLogUpdateManyMutationInput, ProgrammeActivityLogUncheckedUpdateManyInput>
    /**
     * Filter which ProgrammeActivityLogs to update
     */
    where?: ProgrammeActivityLogWhereInput
    /**
     * Limit how many ProgrammeActivityLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProgrammeActivityLog upsert
   */
  export type ProgrammeActivityLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ProgrammeActivityLog to update in case it exists.
     */
    where: ProgrammeActivityLogWhereUniqueInput
    /**
     * In case the ProgrammeActivityLog found by the `where` argument doesn't exist, create a new ProgrammeActivityLog with this data.
     */
    create: XOR<ProgrammeActivityLogCreateInput, ProgrammeActivityLogUncheckedCreateInput>
    /**
     * In case the ProgrammeActivityLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProgrammeActivityLogUpdateInput, ProgrammeActivityLogUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ProgrammeActivityLog delete
   */
  export type ProgrammeActivityLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
    /**
     * Filter which ProgrammeActivityLog to delete.
     */
    where: ProgrammeActivityLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ProgrammeActivityLog deleteMany
   */
  export type ProgrammeActivityLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProgrammeActivityLogs to delete
     */
    where?: ProgrammeActivityLogWhereInput
    /**
     * Limit how many ProgrammeActivityLogs to delete.
     */
    limit?: number
  }

  /**
   * ProgrammeActivityLog without action
   */
  export type ProgrammeActivityLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProgrammeActivityLog
     */
    select?: ProgrammeActivityLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProgrammeActivityLog
     */
    omit?: ProgrammeActivityLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProgrammeActivityLogInclude<ExtArgs> | null
  }


  /**
   * Model Workout
   */

  export type AggregateWorkout = {
    _count: WorkoutCountAggregateOutputType | null
    _avg: WorkoutAvgAggregateOutputType | null
    _sum: WorkoutSumAggregateOutputType | null
    _min: WorkoutMinAggregateOutputType | null
    _max: WorkoutMaxAggregateOutputType | null
  }

  export type WorkoutAvgAggregateOutputType = {
    order_index: number | null
  }

  export type WorkoutSumAggregateOutputType = {
    order_index: number | null
  }

  export type WorkoutMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    order_index: number | null
    programme_id: string | null
  }

  export type WorkoutMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    order_index: number | null
    programme_id: string | null
  }

  export type WorkoutCountAggregateOutputType = {
    id: number
    name: number
    description: number
    order_index: number
    programme_id: number
    _all: number
  }


  export type WorkoutAvgAggregateInputType = {
    order_index?: true
  }

  export type WorkoutSumAggregateInputType = {
    order_index?: true
  }

  export type WorkoutMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    order_index?: true
    programme_id?: true
  }

  export type WorkoutMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    order_index?: true
    programme_id?: true
  }

  export type WorkoutCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    order_index?: true
    programme_id?: true
    _all?: true
  }

  export type WorkoutAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workout to aggregate.
     */
    where?: WorkoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workouts to fetch.
     */
    orderBy?: WorkoutOrderByWithRelationInput | WorkoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workouts
    **/
    _count?: true | WorkoutCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WorkoutAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WorkoutSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkoutMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkoutMaxAggregateInputType
  }

  export type GetWorkoutAggregateType<T extends WorkoutAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkout]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkout[P]>
      : GetScalarType<T[P], AggregateWorkout[P]>
  }




  export type WorkoutGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkoutWhereInput
    orderBy?: WorkoutOrderByWithAggregationInput | WorkoutOrderByWithAggregationInput[]
    by: WorkoutScalarFieldEnum[] | WorkoutScalarFieldEnum
    having?: WorkoutScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkoutCountAggregateInputType | true
    _avg?: WorkoutAvgAggregateInputType
    _sum?: WorkoutSumAggregateInputType
    _min?: WorkoutMinAggregateInputType
    _max?: WorkoutMaxAggregateInputType
  }

  export type WorkoutGroupByOutputType = {
    id: string
    name: string
    description: string | null
    order_index: number
    programme_id: string
    _count: WorkoutCountAggregateOutputType | null
    _avg: WorkoutAvgAggregateOutputType | null
    _sum: WorkoutSumAggregateOutputType | null
    _min: WorkoutMinAggregateOutputType | null
    _max: WorkoutMaxAggregateOutputType | null
  }

  type GetWorkoutGroupByPayload<T extends WorkoutGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkoutGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkoutGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkoutGroupByOutputType[P]>
            : GetScalarType<T[P], WorkoutGroupByOutputType[P]>
        }
      >
    >


  export type WorkoutSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    order_index?: boolean
    programme_id?: boolean
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
    exercisesWithMetadata?: boolean | Workout$exercisesWithMetadataArgs<ExtArgs>
    workoutSessions?: boolean | Workout$workoutSessionsArgs<ExtArgs>
    _count?: boolean | WorkoutCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workout"]>

  export type WorkoutSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    order_index?: boolean
    programme_id?: boolean
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workout"]>

  export type WorkoutSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    order_index?: boolean
    programme_id?: boolean
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workout"]>

  export type WorkoutSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    order_index?: boolean
    programme_id?: boolean
  }

  export type WorkoutOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "order_index" | "programme_id", ExtArgs["result"]["workout"]>
  export type WorkoutInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
    exercisesWithMetadata?: boolean | Workout$exercisesWithMetadataArgs<ExtArgs>
    workoutSessions?: boolean | Workout$workoutSessionsArgs<ExtArgs>
    _count?: boolean | WorkoutCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkoutIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
  }
  export type WorkoutIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programme?: boolean | ProgrammeDefaultArgs<ExtArgs>
  }

  export type $WorkoutPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Workout"
    objects: {
      programme: Prisma.$ProgrammePayload<ExtArgs>
      exercisesWithMetadata: Prisma.$ExerciseWithMetadataPayload<ExtArgs>[]
      workoutSessions: Prisma.$WorkoutSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      /**
       * Position of this workout within its parent WorkoutGroup
       */
      order_index: number
      programme_id: string
    }, ExtArgs["result"]["workout"]>
    composites: {}
  }

  type WorkoutGetPayload<S extends boolean | null | undefined | WorkoutDefaultArgs> = $Result.GetResult<Prisma.$WorkoutPayload, S>

  type WorkoutCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkoutFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: WorkoutCountAggregateInputType | true
    }

  export interface WorkoutDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Workout'], meta: { name: 'Workout' } }
    /**
     * Find zero or one Workout that matches the filter.
     * @param {WorkoutFindUniqueArgs} args - Arguments to find a Workout
     * @example
     * // Get one Workout
     * const workout = await prisma.workout.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkoutFindUniqueArgs>(args: SelectSubset<T, WorkoutFindUniqueArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Workout that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkoutFindUniqueOrThrowArgs} args - Arguments to find a Workout
     * @example
     * // Get one Workout
     * const workout = await prisma.workout.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkoutFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkoutFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workout that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutFindFirstArgs} args - Arguments to find a Workout
     * @example
     * // Get one Workout
     * const workout = await prisma.workout.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkoutFindFirstArgs>(args?: SelectSubset<T, WorkoutFindFirstArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workout that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutFindFirstOrThrowArgs} args - Arguments to find a Workout
     * @example
     * // Get one Workout
     * const workout = await prisma.workout.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkoutFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkoutFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Workouts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workouts
     * const workouts = await prisma.workout.findMany()
     * 
     * // Get first 10 Workouts
     * const workouts = await prisma.workout.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workoutWithIdOnly = await prisma.workout.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkoutFindManyArgs>(args?: SelectSubset<T, WorkoutFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Workout.
     * @param {WorkoutCreateArgs} args - Arguments to create a Workout.
     * @example
     * // Create one Workout
     * const Workout = await prisma.workout.create({
     *   data: {
     *     // ... data to create a Workout
     *   }
     * })
     * 
     */
    create<T extends WorkoutCreateArgs>(args: SelectSubset<T, WorkoutCreateArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Workouts.
     * @param {WorkoutCreateManyArgs} args - Arguments to create many Workouts.
     * @example
     * // Create many Workouts
     * const workout = await prisma.workout.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkoutCreateManyArgs>(args?: SelectSubset<T, WorkoutCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workouts and returns the data saved in the database.
     * @param {WorkoutCreateManyAndReturnArgs} args - Arguments to create many Workouts.
     * @example
     * // Create many Workouts
     * const workout = await prisma.workout.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workouts and only return the `id`
     * const workoutWithIdOnly = await prisma.workout.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkoutCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkoutCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Workout.
     * @param {WorkoutDeleteArgs} args - Arguments to delete one Workout.
     * @example
     * // Delete one Workout
     * const Workout = await prisma.workout.delete({
     *   where: {
     *     // ... filter to delete one Workout
     *   }
     * })
     * 
     */
    delete<T extends WorkoutDeleteArgs>(args: SelectSubset<T, WorkoutDeleteArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Workout.
     * @param {WorkoutUpdateArgs} args - Arguments to update one Workout.
     * @example
     * // Update one Workout
     * const workout = await prisma.workout.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkoutUpdateArgs>(args: SelectSubset<T, WorkoutUpdateArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Workouts.
     * @param {WorkoutDeleteManyArgs} args - Arguments to filter Workouts to delete.
     * @example
     * // Delete a few Workouts
     * const { count } = await prisma.workout.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkoutDeleteManyArgs>(args?: SelectSubset<T, WorkoutDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workouts
     * const workout = await prisma.workout.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkoutUpdateManyArgs>(args: SelectSubset<T, WorkoutUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workouts and returns the data updated in the database.
     * @param {WorkoutUpdateManyAndReturnArgs} args - Arguments to update many Workouts.
     * @example
     * // Update many Workouts
     * const workout = await prisma.workout.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Workouts and only return the `id`
     * const workoutWithIdOnly = await prisma.workout.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkoutUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkoutUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Workout.
     * @param {WorkoutUpsertArgs} args - Arguments to update or create a Workout.
     * @example
     * // Update or create a Workout
     * const workout = await prisma.workout.upsert({
     *   create: {
     *     // ... data to create a Workout
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workout we want to update
     *   }
     * })
     */
    upsert<T extends WorkoutUpsertArgs>(args: SelectSubset<T, WorkoutUpsertArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Workouts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutCountArgs} args - Arguments to filter Workouts to count.
     * @example
     * // Count the number of Workouts
     * const count = await prisma.workout.count({
     *   where: {
     *     // ... the filter for the Workouts we want to count
     *   }
     * })
    **/
    count<T extends WorkoutCountArgs>(
      args?: Subset<T, WorkoutCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkoutCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workout.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkoutAggregateArgs>(args: Subset<T, WorkoutAggregateArgs>): Prisma.PrismaPromise<GetWorkoutAggregateType<T>>

    /**
     * Group by Workout.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkoutGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkoutGroupByArgs['orderBy'] }
        : { orderBy?: WorkoutGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkoutGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkoutGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Workout model
   */
  readonly fields: WorkoutFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Workout.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkoutClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    programme<T extends ProgrammeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProgrammeDefaultArgs<ExtArgs>>): Prisma__ProgrammeClient<$Result.GetResult<Prisma.$ProgrammePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    exercisesWithMetadata<T extends Workout$exercisesWithMetadataArgs<ExtArgs> = {}>(args?: Subset<T, Workout$exercisesWithMetadataArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    workoutSessions<T extends Workout$workoutSessionsArgs<ExtArgs> = {}>(args?: Subset<T, Workout$workoutSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Workout model
   */
  interface WorkoutFieldRefs {
    readonly id: FieldRef<"Workout", 'String'>
    readonly name: FieldRef<"Workout", 'String'>
    readonly description: FieldRef<"Workout", 'String'>
    readonly order_index: FieldRef<"Workout", 'Int'>
    readonly programme_id: FieldRef<"Workout", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Workout findUnique
   */
  export type WorkoutFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    /**
     * Filter, which Workout to fetch.
     */
    where: WorkoutWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Workout findUniqueOrThrow
   */
  export type WorkoutFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    /**
     * Filter, which Workout to fetch.
     */
    where: WorkoutWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Workout findFirst
   */
  export type WorkoutFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    /**
     * Filter, which Workout to fetch.
     */
    where?: WorkoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workouts to fetch.
     */
    orderBy?: WorkoutOrderByWithRelationInput | WorkoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workouts.
     */
    cursor?: WorkoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workouts.
     */
    distinct?: WorkoutScalarFieldEnum | WorkoutScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Workout findFirstOrThrow
   */
  export type WorkoutFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    /**
     * Filter, which Workout to fetch.
     */
    where?: WorkoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workouts to fetch.
     */
    orderBy?: WorkoutOrderByWithRelationInput | WorkoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workouts.
     */
    cursor?: WorkoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workouts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workouts.
     */
    distinct?: WorkoutScalarFieldEnum | WorkoutScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Workout findMany
   */
  export type WorkoutFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    /**
     * Filter, which Workouts to fetch.
     */
    where?: WorkoutWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workouts to fetch.
     */
    orderBy?: WorkoutOrderByWithRelationInput | WorkoutOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workouts.
     */
    cursor?: WorkoutWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workouts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workouts.
     */
    skip?: number
    distinct?: WorkoutScalarFieldEnum | WorkoutScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Workout create
   */
  export type WorkoutCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    /**
     * The data needed to create a Workout.
     */
    data: XOR<WorkoutCreateInput, WorkoutUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Workout createMany
   */
  export type WorkoutCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workouts.
     */
    data: WorkoutCreateManyInput | WorkoutCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workout createManyAndReturn
   */
  export type WorkoutCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * The data used to create many Workouts.
     */
    data: WorkoutCreateManyInput | WorkoutCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workout update
   */
  export type WorkoutUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    /**
     * The data needed to update a Workout.
     */
    data: XOR<WorkoutUpdateInput, WorkoutUncheckedUpdateInput>
    /**
     * Choose, which Workout to update.
     */
    where: WorkoutWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Workout updateMany
   */
  export type WorkoutUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workouts.
     */
    data: XOR<WorkoutUpdateManyMutationInput, WorkoutUncheckedUpdateManyInput>
    /**
     * Filter which Workouts to update
     */
    where?: WorkoutWhereInput
    /**
     * Limit how many Workouts to update.
     */
    limit?: number
  }

  /**
   * Workout updateManyAndReturn
   */
  export type WorkoutUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * The data used to update Workouts.
     */
    data: XOR<WorkoutUpdateManyMutationInput, WorkoutUncheckedUpdateManyInput>
    /**
     * Filter which Workouts to update
     */
    where?: WorkoutWhereInput
    /**
     * Limit how many Workouts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workout upsert
   */
  export type WorkoutUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    /**
     * The filter to search for the Workout to update in case it exists.
     */
    where: WorkoutWhereUniqueInput
    /**
     * In case the Workout found by the `where` argument doesn't exist, create a new Workout with this data.
     */
    create: XOR<WorkoutCreateInput, WorkoutUncheckedCreateInput>
    /**
     * In case the Workout was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkoutUpdateInput, WorkoutUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Workout delete
   */
  export type WorkoutDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    /**
     * Filter which Workout to delete.
     */
    where: WorkoutWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Workout deleteMany
   */
  export type WorkoutDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workouts to delete
     */
    where?: WorkoutWhereInput
    /**
     * Limit how many Workouts to delete.
     */
    limit?: number
  }

  /**
   * Workout.exercisesWithMetadata
   */
  export type Workout$exercisesWithMetadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    where?: ExerciseWithMetadataWhereInput
    orderBy?: ExerciseWithMetadataOrderByWithRelationInput | ExerciseWithMetadataOrderByWithRelationInput[]
    cursor?: ExerciseWithMetadataWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExerciseWithMetadataScalarFieldEnum | ExerciseWithMetadataScalarFieldEnum[]
  }

  /**
   * Workout.workoutSessions
   */
  export type Workout$workoutSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    where?: WorkoutSessionWhereInput
    orderBy?: WorkoutSessionOrderByWithRelationInput | WorkoutSessionOrderByWithRelationInput[]
    cursor?: WorkoutSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkoutSessionScalarFieldEnum | WorkoutSessionScalarFieldEnum[]
  }

  /**
   * Workout without action
   */
  export type WorkoutDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
  }


  /**
   * Model WorkoutSession
   */

  export type AggregateWorkoutSession = {
    _count: WorkoutSessionCountAggregateOutputType | null
    _min: WorkoutSessionMinAggregateOutputType | null
    _max: WorkoutSessionMaxAggregateOutputType | null
  }

  export type WorkoutSessionMinAggregateOutputType = {
    id: string | null
    start_time: Date | null
    end_time: Date | null
    notes: string | null
    date: Date | null
    workout_id: string | null
    user_id: string | null
  }

  export type WorkoutSessionMaxAggregateOutputType = {
    id: string | null
    start_time: Date | null
    end_time: Date | null
    notes: string | null
    date: Date | null
    workout_id: string | null
    user_id: string | null
  }

  export type WorkoutSessionCountAggregateOutputType = {
    id: number
    start_time: number
    end_time: number
    notes: number
    date: number
    workout_id: number
    user_id: number
    _all: number
  }


  export type WorkoutSessionMinAggregateInputType = {
    id?: true
    start_time?: true
    end_time?: true
    notes?: true
    date?: true
    workout_id?: true
    user_id?: true
  }

  export type WorkoutSessionMaxAggregateInputType = {
    id?: true
    start_time?: true
    end_time?: true
    notes?: true
    date?: true
    workout_id?: true
    user_id?: true
  }

  export type WorkoutSessionCountAggregateInputType = {
    id?: true
    start_time?: true
    end_time?: true
    notes?: true
    date?: true
    workout_id?: true
    user_id?: true
    _all?: true
  }

  export type WorkoutSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkoutSession to aggregate.
     */
    where?: WorkoutSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkoutSessions to fetch.
     */
    orderBy?: WorkoutSessionOrderByWithRelationInput | WorkoutSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkoutSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkoutSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkoutSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkoutSessions
    **/
    _count?: true | WorkoutSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkoutSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkoutSessionMaxAggregateInputType
  }

  export type GetWorkoutSessionAggregateType<T extends WorkoutSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkoutSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkoutSession[P]>
      : GetScalarType<T[P], AggregateWorkoutSession[P]>
  }




  export type WorkoutSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkoutSessionWhereInput
    orderBy?: WorkoutSessionOrderByWithAggregationInput | WorkoutSessionOrderByWithAggregationInput[]
    by: WorkoutSessionScalarFieldEnum[] | WorkoutSessionScalarFieldEnum
    having?: WorkoutSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkoutSessionCountAggregateInputType | true
    _min?: WorkoutSessionMinAggregateInputType
    _max?: WorkoutSessionMaxAggregateInputType
  }

  export type WorkoutSessionGroupByOutputType = {
    id: string
    start_time: Date | null
    end_time: Date | null
    notes: string | null
    date: Date
    workout_id: string | null
    user_id: string
    _count: WorkoutSessionCountAggregateOutputType | null
    _min: WorkoutSessionMinAggregateOutputType | null
    _max: WorkoutSessionMaxAggregateOutputType | null
  }

  type GetWorkoutSessionGroupByPayload<T extends WorkoutSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkoutSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkoutSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkoutSessionGroupByOutputType[P]>
            : GetScalarType<T[P], WorkoutSessionGroupByOutputType[P]>
        }
      >
    >


  export type WorkoutSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start_time?: boolean
    end_time?: boolean
    notes?: boolean
    date?: boolean
    workout_id?: boolean
    user_id?: boolean
    workout?: boolean | WorkoutSession$workoutArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    sessionExerciseLogs?: boolean | WorkoutSession$sessionExerciseLogsArgs<ExtArgs>
    _count?: boolean | WorkoutSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workoutSession"]>

  export type WorkoutSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start_time?: boolean
    end_time?: boolean
    notes?: boolean
    date?: boolean
    workout_id?: boolean
    user_id?: boolean
    workout?: boolean | WorkoutSession$workoutArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workoutSession"]>

  export type WorkoutSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    start_time?: boolean
    end_time?: boolean
    notes?: boolean
    date?: boolean
    workout_id?: boolean
    user_id?: boolean
    workout?: boolean | WorkoutSession$workoutArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workoutSession"]>

  export type WorkoutSessionSelectScalar = {
    id?: boolean
    start_time?: boolean
    end_time?: boolean
    notes?: boolean
    date?: boolean
    workout_id?: boolean
    user_id?: boolean
  }

  export type WorkoutSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "start_time" | "end_time" | "notes" | "date" | "workout_id" | "user_id", ExtArgs["result"]["workoutSession"]>
  export type WorkoutSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workout?: boolean | WorkoutSession$workoutArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    sessionExerciseLogs?: boolean | WorkoutSession$sessionExerciseLogsArgs<ExtArgs>
    _count?: boolean | WorkoutSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkoutSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workout?: boolean | WorkoutSession$workoutArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WorkoutSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workout?: boolean | WorkoutSession$workoutArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WorkoutSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkoutSession"
    objects: {
      workout: Prisma.$WorkoutPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs>
      sessionExerciseLogs: Prisma.$SessionExerciseLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      start_time: Date | null
      end_time: Date | null
      notes: string | null
      date: Date
      workout_id: string | null
      user_id: string
    }, ExtArgs["result"]["workoutSession"]>
    composites: {}
  }

  type WorkoutSessionGetPayload<S extends boolean | null | undefined | WorkoutSessionDefaultArgs> = $Result.GetResult<Prisma.$WorkoutSessionPayload, S>

  type WorkoutSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkoutSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: WorkoutSessionCountAggregateInputType | true
    }

  export interface WorkoutSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkoutSession'], meta: { name: 'WorkoutSession' } }
    /**
     * Find zero or one WorkoutSession that matches the filter.
     * @param {WorkoutSessionFindUniqueArgs} args - Arguments to find a WorkoutSession
     * @example
     * // Get one WorkoutSession
     * const workoutSession = await prisma.workoutSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkoutSessionFindUniqueArgs>(args: SelectSubset<T, WorkoutSessionFindUniqueArgs<ExtArgs>>): Prisma__WorkoutSessionClient<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkoutSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkoutSessionFindUniqueOrThrowArgs} args - Arguments to find a WorkoutSession
     * @example
     * // Get one WorkoutSession
     * const workoutSession = await prisma.workoutSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkoutSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkoutSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkoutSessionClient<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkoutSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutSessionFindFirstArgs} args - Arguments to find a WorkoutSession
     * @example
     * // Get one WorkoutSession
     * const workoutSession = await prisma.workoutSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkoutSessionFindFirstArgs>(args?: SelectSubset<T, WorkoutSessionFindFirstArgs<ExtArgs>>): Prisma__WorkoutSessionClient<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkoutSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutSessionFindFirstOrThrowArgs} args - Arguments to find a WorkoutSession
     * @example
     * // Get one WorkoutSession
     * const workoutSession = await prisma.workoutSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkoutSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkoutSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkoutSessionClient<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkoutSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkoutSessions
     * const workoutSessions = await prisma.workoutSession.findMany()
     * 
     * // Get first 10 WorkoutSessions
     * const workoutSessions = await prisma.workoutSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workoutSessionWithIdOnly = await prisma.workoutSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkoutSessionFindManyArgs>(args?: SelectSubset<T, WorkoutSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkoutSession.
     * @param {WorkoutSessionCreateArgs} args - Arguments to create a WorkoutSession.
     * @example
     * // Create one WorkoutSession
     * const WorkoutSession = await prisma.workoutSession.create({
     *   data: {
     *     // ... data to create a WorkoutSession
     *   }
     * })
     * 
     */
    create<T extends WorkoutSessionCreateArgs>(args: SelectSubset<T, WorkoutSessionCreateArgs<ExtArgs>>): Prisma__WorkoutSessionClient<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkoutSessions.
     * @param {WorkoutSessionCreateManyArgs} args - Arguments to create many WorkoutSessions.
     * @example
     * // Create many WorkoutSessions
     * const workoutSession = await prisma.workoutSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkoutSessionCreateManyArgs>(args?: SelectSubset<T, WorkoutSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkoutSessions and returns the data saved in the database.
     * @param {WorkoutSessionCreateManyAndReturnArgs} args - Arguments to create many WorkoutSessions.
     * @example
     * // Create many WorkoutSessions
     * const workoutSession = await prisma.workoutSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkoutSessions and only return the `id`
     * const workoutSessionWithIdOnly = await prisma.workoutSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkoutSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkoutSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkoutSession.
     * @param {WorkoutSessionDeleteArgs} args - Arguments to delete one WorkoutSession.
     * @example
     * // Delete one WorkoutSession
     * const WorkoutSession = await prisma.workoutSession.delete({
     *   where: {
     *     // ... filter to delete one WorkoutSession
     *   }
     * })
     * 
     */
    delete<T extends WorkoutSessionDeleteArgs>(args: SelectSubset<T, WorkoutSessionDeleteArgs<ExtArgs>>): Prisma__WorkoutSessionClient<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkoutSession.
     * @param {WorkoutSessionUpdateArgs} args - Arguments to update one WorkoutSession.
     * @example
     * // Update one WorkoutSession
     * const workoutSession = await prisma.workoutSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkoutSessionUpdateArgs>(args: SelectSubset<T, WorkoutSessionUpdateArgs<ExtArgs>>): Prisma__WorkoutSessionClient<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkoutSessions.
     * @param {WorkoutSessionDeleteManyArgs} args - Arguments to filter WorkoutSessions to delete.
     * @example
     * // Delete a few WorkoutSessions
     * const { count } = await prisma.workoutSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkoutSessionDeleteManyArgs>(args?: SelectSubset<T, WorkoutSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkoutSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkoutSessions
     * const workoutSession = await prisma.workoutSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkoutSessionUpdateManyArgs>(args: SelectSubset<T, WorkoutSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkoutSessions and returns the data updated in the database.
     * @param {WorkoutSessionUpdateManyAndReturnArgs} args - Arguments to update many WorkoutSessions.
     * @example
     * // Update many WorkoutSessions
     * const workoutSession = await prisma.workoutSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkoutSessions and only return the `id`
     * const workoutSessionWithIdOnly = await prisma.workoutSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkoutSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkoutSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkoutSession.
     * @param {WorkoutSessionUpsertArgs} args - Arguments to update or create a WorkoutSession.
     * @example
     * // Update or create a WorkoutSession
     * const workoutSession = await prisma.workoutSession.upsert({
     *   create: {
     *     // ... data to create a WorkoutSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkoutSession we want to update
     *   }
     * })
     */
    upsert<T extends WorkoutSessionUpsertArgs>(args: SelectSubset<T, WorkoutSessionUpsertArgs<ExtArgs>>): Prisma__WorkoutSessionClient<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkoutSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutSessionCountArgs} args - Arguments to filter WorkoutSessions to count.
     * @example
     * // Count the number of WorkoutSessions
     * const count = await prisma.workoutSession.count({
     *   where: {
     *     // ... the filter for the WorkoutSessions we want to count
     *   }
     * })
    **/
    count<T extends WorkoutSessionCountArgs>(
      args?: Subset<T, WorkoutSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkoutSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkoutSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkoutSessionAggregateArgs>(args: Subset<T, WorkoutSessionAggregateArgs>): Prisma.PrismaPromise<GetWorkoutSessionAggregateType<T>>

    /**
     * Group by WorkoutSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkoutSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkoutSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkoutSessionGroupByArgs['orderBy'] }
        : { orderBy?: WorkoutSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkoutSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkoutSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkoutSession model
   */
  readonly fields: WorkoutSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkoutSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkoutSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workout<T extends WorkoutSession$workoutArgs<ExtArgs> = {}>(args?: Subset<T, WorkoutSession$workoutArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sessionExerciseLogs<T extends WorkoutSession$sessionExerciseLogsArgs<ExtArgs> = {}>(args?: Subset<T, WorkoutSession$sessionExerciseLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkoutSession model
   */
  interface WorkoutSessionFieldRefs {
    readonly id: FieldRef<"WorkoutSession", 'String'>
    readonly start_time: FieldRef<"WorkoutSession", 'DateTime'>
    readonly end_time: FieldRef<"WorkoutSession", 'DateTime'>
    readonly notes: FieldRef<"WorkoutSession", 'String'>
    readonly date: FieldRef<"WorkoutSession", 'DateTime'>
    readonly workout_id: FieldRef<"WorkoutSession", 'String'>
    readonly user_id: FieldRef<"WorkoutSession", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WorkoutSession findUnique
   */
  export type WorkoutSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    /**
     * Filter, which WorkoutSession to fetch.
     */
    where: WorkoutSessionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * WorkoutSession findUniqueOrThrow
   */
  export type WorkoutSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    /**
     * Filter, which WorkoutSession to fetch.
     */
    where: WorkoutSessionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * WorkoutSession findFirst
   */
  export type WorkoutSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    /**
     * Filter, which WorkoutSession to fetch.
     */
    where?: WorkoutSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkoutSessions to fetch.
     */
    orderBy?: WorkoutSessionOrderByWithRelationInput | WorkoutSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkoutSessions.
     */
    cursor?: WorkoutSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkoutSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkoutSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkoutSessions.
     */
    distinct?: WorkoutSessionScalarFieldEnum | WorkoutSessionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * WorkoutSession findFirstOrThrow
   */
  export type WorkoutSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    /**
     * Filter, which WorkoutSession to fetch.
     */
    where?: WorkoutSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkoutSessions to fetch.
     */
    orderBy?: WorkoutSessionOrderByWithRelationInput | WorkoutSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkoutSessions.
     */
    cursor?: WorkoutSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkoutSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkoutSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkoutSessions.
     */
    distinct?: WorkoutSessionScalarFieldEnum | WorkoutSessionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * WorkoutSession findMany
   */
  export type WorkoutSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    /**
     * Filter, which WorkoutSessions to fetch.
     */
    where?: WorkoutSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkoutSessions to fetch.
     */
    orderBy?: WorkoutSessionOrderByWithRelationInput | WorkoutSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkoutSessions.
     */
    cursor?: WorkoutSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkoutSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkoutSessions.
     */
    skip?: number
    distinct?: WorkoutSessionScalarFieldEnum | WorkoutSessionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * WorkoutSession create
   */
  export type WorkoutSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkoutSession.
     */
    data: XOR<WorkoutSessionCreateInput, WorkoutSessionUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * WorkoutSession createMany
   */
  export type WorkoutSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkoutSessions.
     */
    data: WorkoutSessionCreateManyInput | WorkoutSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkoutSession createManyAndReturn
   */
  export type WorkoutSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * The data used to create many WorkoutSessions.
     */
    data: WorkoutSessionCreateManyInput | WorkoutSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkoutSession update
   */
  export type WorkoutSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkoutSession.
     */
    data: XOR<WorkoutSessionUpdateInput, WorkoutSessionUncheckedUpdateInput>
    /**
     * Choose, which WorkoutSession to update.
     */
    where: WorkoutSessionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * WorkoutSession updateMany
   */
  export type WorkoutSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkoutSessions.
     */
    data: XOR<WorkoutSessionUpdateManyMutationInput, WorkoutSessionUncheckedUpdateManyInput>
    /**
     * Filter which WorkoutSessions to update
     */
    where?: WorkoutSessionWhereInput
    /**
     * Limit how many WorkoutSessions to update.
     */
    limit?: number
  }

  /**
   * WorkoutSession updateManyAndReturn
   */
  export type WorkoutSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * The data used to update WorkoutSessions.
     */
    data: XOR<WorkoutSessionUpdateManyMutationInput, WorkoutSessionUncheckedUpdateManyInput>
    /**
     * Filter which WorkoutSessions to update
     */
    where?: WorkoutSessionWhereInput
    /**
     * Limit how many WorkoutSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkoutSession upsert
   */
  export type WorkoutSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkoutSession to update in case it exists.
     */
    where: WorkoutSessionWhereUniqueInput
    /**
     * In case the WorkoutSession found by the `where` argument doesn't exist, create a new WorkoutSession with this data.
     */
    create: XOR<WorkoutSessionCreateInput, WorkoutSessionUncheckedCreateInput>
    /**
     * In case the WorkoutSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkoutSessionUpdateInput, WorkoutSessionUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * WorkoutSession delete
   */
  export type WorkoutSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
    /**
     * Filter which WorkoutSession to delete.
     */
    where: WorkoutSessionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * WorkoutSession deleteMany
   */
  export type WorkoutSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkoutSessions to delete
     */
    where?: WorkoutSessionWhereInput
    /**
     * Limit how many WorkoutSessions to delete.
     */
    limit?: number
  }

  /**
   * WorkoutSession.workout
   */
  export type WorkoutSession$workoutArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workout
     */
    select?: WorkoutSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workout
     */
    omit?: WorkoutOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutInclude<ExtArgs> | null
    where?: WorkoutWhereInput
  }

  /**
   * WorkoutSession.sessionExerciseLogs
   */
  export type WorkoutSession$sessionExerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    where?: SessionExerciseLogWhereInput
    orderBy?: SessionExerciseLogOrderByWithRelationInput | SessionExerciseLogOrderByWithRelationInput[]
    cursor?: SessionExerciseLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionExerciseLogScalarFieldEnum | SessionExerciseLogScalarFieldEnum[]
  }

  /**
   * WorkoutSession without action
   */
  export type WorkoutSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkoutSession
     */
    select?: WorkoutSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkoutSession
     */
    omit?: WorkoutSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkoutSessionInclude<ExtArgs> | null
  }


  /**
   * Model ExerciseWithMetadata
   */

  export type AggregateExerciseWithMetadata = {
    _count: ExerciseWithMetadataCountAggregateOutputType | null
    _avg: ExerciseWithMetadataAvgAggregateOutputType | null
    _sum: ExerciseWithMetadataSumAggregateOutputType | null
    _min: ExerciseWithMetadataMinAggregateOutputType | null
    _max: ExerciseWithMetadataMaxAggregateOutputType | null
  }

  export type ExerciseWithMetadataAvgAggregateOutputType = {
    reps_min: number | null
    reps_max: number | null
    sets_min: number | null
    sets_max: number | null
    rest_min: number | null
    rest_max: number | null
    order_index: number | null
  }

  export type ExerciseWithMetadataSumAggregateOutputType = {
    reps_min: number | null
    reps_max: number | null
    sets_min: number | null
    sets_max: number | null
    rest_min: number | null
    rest_max: number | null
    order_index: number | null
  }

  export type ExerciseWithMetadataMinAggregateOutputType = {
    id: string | null
    reps_min: number | null
    reps_max: number | null
    sets_min: number | null
    sets_max: number | null
    rest_min: number | null
    rest_max: number | null
    tempo: string | null
    order_index: number | null
    is_hidden: boolean | null
    exercise_id: string | null
    workout_id: string | null
  }

  export type ExerciseWithMetadataMaxAggregateOutputType = {
    id: string | null
    reps_min: number | null
    reps_max: number | null
    sets_min: number | null
    sets_max: number | null
    rest_min: number | null
    rest_max: number | null
    tempo: string | null
    order_index: number | null
    is_hidden: boolean | null
    exercise_id: string | null
    workout_id: string | null
  }

  export type ExerciseWithMetadataCountAggregateOutputType = {
    id: number
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: number
    order_index: number
    is_hidden: number
    exercise_id: number
    workout_id: number
    _all: number
  }


  export type ExerciseWithMetadataAvgAggregateInputType = {
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    order_index?: true
  }

  export type ExerciseWithMetadataSumAggregateInputType = {
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    order_index?: true
  }

  export type ExerciseWithMetadataMinAggregateInputType = {
    id?: true
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    tempo?: true
    order_index?: true
    is_hidden?: true
    exercise_id?: true
    workout_id?: true
  }

  export type ExerciseWithMetadataMaxAggregateInputType = {
    id?: true
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    tempo?: true
    order_index?: true
    is_hidden?: true
    exercise_id?: true
    workout_id?: true
  }

  export type ExerciseWithMetadataCountAggregateInputType = {
    id?: true
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    tempo?: true
    order_index?: true
    is_hidden?: true
    exercise_id?: true
    workout_id?: true
    _all?: true
  }

  export type ExerciseWithMetadataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExerciseWithMetadata to aggregate.
     */
    where?: ExerciseWithMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseWithMetadata to fetch.
     */
    orderBy?: ExerciseWithMetadataOrderByWithRelationInput | ExerciseWithMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExerciseWithMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseWithMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseWithMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExerciseWithMetadata
    **/
    _count?: true | ExerciseWithMetadataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExerciseWithMetadataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExerciseWithMetadataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExerciseWithMetadataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExerciseWithMetadataMaxAggregateInputType
  }

  export type GetExerciseWithMetadataAggregateType<T extends ExerciseWithMetadataAggregateArgs> = {
        [P in keyof T & keyof AggregateExerciseWithMetadata]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExerciseWithMetadata[P]>
      : GetScalarType<T[P], AggregateExerciseWithMetadata[P]>
  }




  export type ExerciseWithMetadataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseWithMetadataWhereInput
    orderBy?: ExerciseWithMetadataOrderByWithAggregationInput | ExerciseWithMetadataOrderByWithAggregationInput[]
    by: ExerciseWithMetadataScalarFieldEnum[] | ExerciseWithMetadataScalarFieldEnum
    having?: ExerciseWithMetadataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExerciseWithMetadataCountAggregateInputType | true
    _avg?: ExerciseWithMetadataAvgAggregateInputType
    _sum?: ExerciseWithMetadataSumAggregateInputType
    _min?: ExerciseWithMetadataMinAggregateInputType
    _max?: ExerciseWithMetadataMaxAggregateInputType
  }

  export type ExerciseWithMetadataGroupByOutputType = {
    id: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden: boolean
    exercise_id: string
    workout_id: string
    _count: ExerciseWithMetadataCountAggregateOutputType | null
    _avg: ExerciseWithMetadataAvgAggregateOutputType | null
    _sum: ExerciseWithMetadataSumAggregateOutputType | null
    _min: ExerciseWithMetadataMinAggregateOutputType | null
    _max: ExerciseWithMetadataMaxAggregateOutputType | null
  }

  type GetExerciseWithMetadataGroupByPayload<T extends ExerciseWithMetadataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExerciseWithMetadataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExerciseWithMetadataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExerciseWithMetadataGroupByOutputType[P]>
            : GetScalarType<T[P], ExerciseWithMetadataGroupByOutputType[P]>
        }
      >
    >


  export type ExerciseWithMetadataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reps_min?: boolean
    reps_max?: boolean
    sets_min?: boolean
    sets_max?: boolean
    rest_min?: boolean
    rest_max?: boolean
    tempo?: boolean
    order_index?: boolean
    is_hidden?: boolean
    exercise_id?: boolean
    workout_id?: boolean
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    workout?: boolean | WorkoutDefaultArgs<ExtArgs>
    sessionExerciseLogs?: boolean | ExerciseWithMetadata$sessionExerciseLogsArgs<ExtArgs>
    _count?: boolean | ExerciseWithMetadataCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exerciseWithMetadata"]>

  export type ExerciseWithMetadataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reps_min?: boolean
    reps_max?: boolean
    sets_min?: boolean
    sets_max?: boolean
    rest_min?: boolean
    rest_max?: boolean
    tempo?: boolean
    order_index?: boolean
    is_hidden?: boolean
    exercise_id?: boolean
    workout_id?: boolean
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    workout?: boolean | WorkoutDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exerciseWithMetadata"]>

  export type ExerciseWithMetadataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    reps_min?: boolean
    reps_max?: boolean
    sets_min?: boolean
    sets_max?: boolean
    rest_min?: boolean
    rest_max?: boolean
    tempo?: boolean
    order_index?: boolean
    is_hidden?: boolean
    exercise_id?: boolean
    workout_id?: boolean
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    workout?: boolean | WorkoutDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exerciseWithMetadata"]>

  export type ExerciseWithMetadataSelectScalar = {
    id?: boolean
    reps_min?: boolean
    reps_max?: boolean
    sets_min?: boolean
    sets_max?: boolean
    rest_min?: boolean
    rest_max?: boolean
    tempo?: boolean
    order_index?: boolean
    is_hidden?: boolean
    exercise_id?: boolean
    workout_id?: boolean
  }

  export type ExerciseWithMetadataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "reps_min" | "reps_max" | "sets_min" | "sets_max" | "rest_min" | "rest_max" | "tempo" | "order_index" | "is_hidden" | "exercise_id" | "workout_id", ExtArgs["result"]["exerciseWithMetadata"]>
  export type ExerciseWithMetadataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    workout?: boolean | WorkoutDefaultArgs<ExtArgs>
    sessionExerciseLogs?: boolean | ExerciseWithMetadata$sessionExerciseLogsArgs<ExtArgs>
    _count?: boolean | ExerciseWithMetadataCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExerciseWithMetadataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    workout?: boolean | WorkoutDefaultArgs<ExtArgs>
  }
  export type ExerciseWithMetadataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    exercise?: boolean | ExerciseDefaultArgs<ExtArgs>
    workout?: boolean | WorkoutDefaultArgs<ExtArgs>
  }

  export type $ExerciseWithMetadataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExerciseWithMetadata"
    objects: {
      exercise: Prisma.$ExercisePayload<ExtArgs>
      workout: Prisma.$WorkoutPayload<ExtArgs>
      sessionExerciseLogs: Prisma.$SessionExerciseLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      /**
       * Prescribed rep range
       */
      reps_min: number
      reps_max: number
      /**
       * Prescribed set range
       */
      sets_min: number
      sets_max: number
      /**
       * Rest between sets (seconds)
       */
      rest_min: number
      rest_max: number
      /**
       * Tempo in "eccentric-pause-concentric-pause" format, e.g. "3-1-2-0"
       */
      tempo: string
      /**
       * Position of this exercise within its parent workout
       */
      order_index: number
      /**
       * Soft-deleted when a log exists and metadata was replaced by a new record
       */
      is_hidden: boolean
      exercise_id: string
      workout_id: string
    }, ExtArgs["result"]["exerciseWithMetadata"]>
    composites: {}
  }

  type ExerciseWithMetadataGetPayload<S extends boolean | null | undefined | ExerciseWithMetadataDefaultArgs> = $Result.GetResult<Prisma.$ExerciseWithMetadataPayload, S>

  type ExerciseWithMetadataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExerciseWithMetadataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: ExerciseWithMetadataCountAggregateInputType | true
    }

  export interface ExerciseWithMetadataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExerciseWithMetadata'], meta: { name: 'ExerciseWithMetadata' } }
    /**
     * Find zero or one ExerciseWithMetadata that matches the filter.
     * @param {ExerciseWithMetadataFindUniqueArgs} args - Arguments to find a ExerciseWithMetadata
     * @example
     * // Get one ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExerciseWithMetadataFindUniqueArgs>(args: SelectSubset<T, ExerciseWithMetadataFindUniqueArgs<ExtArgs>>): Prisma__ExerciseWithMetadataClient<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExerciseWithMetadata that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExerciseWithMetadataFindUniqueOrThrowArgs} args - Arguments to find a ExerciseWithMetadata
     * @example
     * // Get one ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExerciseWithMetadataFindUniqueOrThrowArgs>(args: SelectSubset<T, ExerciseWithMetadataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExerciseWithMetadataClient<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExerciseWithMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseWithMetadataFindFirstArgs} args - Arguments to find a ExerciseWithMetadata
     * @example
     * // Get one ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExerciseWithMetadataFindFirstArgs>(args?: SelectSubset<T, ExerciseWithMetadataFindFirstArgs<ExtArgs>>): Prisma__ExerciseWithMetadataClient<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExerciseWithMetadata that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseWithMetadataFindFirstOrThrowArgs} args - Arguments to find a ExerciseWithMetadata
     * @example
     * // Get one ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExerciseWithMetadataFindFirstOrThrowArgs>(args?: SelectSubset<T, ExerciseWithMetadataFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExerciseWithMetadataClient<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExerciseWithMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseWithMetadataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.findMany()
     * 
     * // Get first 10 ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exerciseWithMetadataWithIdOnly = await prisma.exerciseWithMetadata.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExerciseWithMetadataFindManyArgs>(args?: SelectSubset<T, ExerciseWithMetadataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExerciseWithMetadata.
     * @param {ExerciseWithMetadataCreateArgs} args - Arguments to create a ExerciseWithMetadata.
     * @example
     * // Create one ExerciseWithMetadata
     * const ExerciseWithMetadata = await prisma.exerciseWithMetadata.create({
     *   data: {
     *     // ... data to create a ExerciseWithMetadata
     *   }
     * })
     * 
     */
    create<T extends ExerciseWithMetadataCreateArgs>(args: SelectSubset<T, ExerciseWithMetadataCreateArgs<ExtArgs>>): Prisma__ExerciseWithMetadataClient<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExerciseWithMetadata.
     * @param {ExerciseWithMetadataCreateManyArgs} args - Arguments to create many ExerciseWithMetadata.
     * @example
     * // Create many ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExerciseWithMetadataCreateManyArgs>(args?: SelectSubset<T, ExerciseWithMetadataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExerciseWithMetadata and returns the data saved in the database.
     * @param {ExerciseWithMetadataCreateManyAndReturnArgs} args - Arguments to create many ExerciseWithMetadata.
     * @example
     * // Create many ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExerciseWithMetadata and only return the `id`
     * const exerciseWithMetadataWithIdOnly = await prisma.exerciseWithMetadata.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExerciseWithMetadataCreateManyAndReturnArgs>(args?: SelectSubset<T, ExerciseWithMetadataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExerciseWithMetadata.
     * @param {ExerciseWithMetadataDeleteArgs} args - Arguments to delete one ExerciseWithMetadata.
     * @example
     * // Delete one ExerciseWithMetadata
     * const ExerciseWithMetadata = await prisma.exerciseWithMetadata.delete({
     *   where: {
     *     // ... filter to delete one ExerciseWithMetadata
     *   }
     * })
     * 
     */
    delete<T extends ExerciseWithMetadataDeleteArgs>(args: SelectSubset<T, ExerciseWithMetadataDeleteArgs<ExtArgs>>): Prisma__ExerciseWithMetadataClient<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExerciseWithMetadata.
     * @param {ExerciseWithMetadataUpdateArgs} args - Arguments to update one ExerciseWithMetadata.
     * @example
     * // Update one ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExerciseWithMetadataUpdateArgs>(args: SelectSubset<T, ExerciseWithMetadataUpdateArgs<ExtArgs>>): Prisma__ExerciseWithMetadataClient<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExerciseWithMetadata.
     * @param {ExerciseWithMetadataDeleteManyArgs} args - Arguments to filter ExerciseWithMetadata to delete.
     * @example
     * // Delete a few ExerciseWithMetadata
     * const { count } = await prisma.exerciseWithMetadata.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExerciseWithMetadataDeleteManyArgs>(args?: SelectSubset<T, ExerciseWithMetadataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExerciseWithMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseWithMetadataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExerciseWithMetadataUpdateManyArgs>(args: SelectSubset<T, ExerciseWithMetadataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExerciseWithMetadata and returns the data updated in the database.
     * @param {ExerciseWithMetadataUpdateManyAndReturnArgs} args - Arguments to update many ExerciseWithMetadata.
     * @example
     * // Update many ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExerciseWithMetadata and only return the `id`
     * const exerciseWithMetadataWithIdOnly = await prisma.exerciseWithMetadata.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExerciseWithMetadataUpdateManyAndReturnArgs>(args: SelectSubset<T, ExerciseWithMetadataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExerciseWithMetadata.
     * @param {ExerciseWithMetadataUpsertArgs} args - Arguments to update or create a ExerciseWithMetadata.
     * @example
     * // Update or create a ExerciseWithMetadata
     * const exerciseWithMetadata = await prisma.exerciseWithMetadata.upsert({
     *   create: {
     *     // ... data to create a ExerciseWithMetadata
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExerciseWithMetadata we want to update
     *   }
     * })
     */
    upsert<T extends ExerciseWithMetadataUpsertArgs>(args: SelectSubset<T, ExerciseWithMetadataUpsertArgs<ExtArgs>>): Prisma__ExerciseWithMetadataClient<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExerciseWithMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseWithMetadataCountArgs} args - Arguments to filter ExerciseWithMetadata to count.
     * @example
     * // Count the number of ExerciseWithMetadata
     * const count = await prisma.exerciseWithMetadata.count({
     *   where: {
     *     // ... the filter for the ExerciseWithMetadata we want to count
     *   }
     * })
    **/
    count<T extends ExerciseWithMetadataCountArgs>(
      args?: Subset<T, ExerciseWithMetadataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExerciseWithMetadataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExerciseWithMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseWithMetadataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExerciseWithMetadataAggregateArgs>(args: Subset<T, ExerciseWithMetadataAggregateArgs>): Prisma.PrismaPromise<GetExerciseWithMetadataAggregateType<T>>

    /**
     * Group by ExerciseWithMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseWithMetadataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExerciseWithMetadataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExerciseWithMetadataGroupByArgs['orderBy'] }
        : { orderBy?: ExerciseWithMetadataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExerciseWithMetadataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExerciseWithMetadataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExerciseWithMetadata model
   */
  readonly fields: ExerciseWithMetadataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExerciseWithMetadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExerciseWithMetadataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    exercise<T extends ExerciseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExerciseDefaultArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    workout<T extends WorkoutDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkoutDefaultArgs<ExtArgs>>): Prisma__WorkoutClient<$Result.GetResult<Prisma.$WorkoutPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    sessionExerciseLogs<T extends ExerciseWithMetadata$sessionExerciseLogsArgs<ExtArgs> = {}>(args?: Subset<T, ExerciseWithMetadata$sessionExerciseLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExerciseWithMetadata model
   */
  interface ExerciseWithMetadataFieldRefs {
    readonly id: FieldRef<"ExerciseWithMetadata", 'String'>
    readonly reps_min: FieldRef<"ExerciseWithMetadata", 'Int'>
    readonly reps_max: FieldRef<"ExerciseWithMetadata", 'Int'>
    readonly sets_min: FieldRef<"ExerciseWithMetadata", 'Int'>
    readonly sets_max: FieldRef<"ExerciseWithMetadata", 'Int'>
    readonly rest_min: FieldRef<"ExerciseWithMetadata", 'Int'>
    readonly rest_max: FieldRef<"ExerciseWithMetadata", 'Int'>
    readonly tempo: FieldRef<"ExerciseWithMetadata", 'String'>
    readonly order_index: FieldRef<"ExerciseWithMetadata", 'Int'>
    readonly is_hidden: FieldRef<"ExerciseWithMetadata", 'Boolean'>
    readonly exercise_id: FieldRef<"ExerciseWithMetadata", 'String'>
    readonly workout_id: FieldRef<"ExerciseWithMetadata", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ExerciseWithMetadata findUnique
   */
  export type ExerciseWithMetadataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseWithMetadata to fetch.
     */
    where: ExerciseWithMetadataWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseWithMetadata findUniqueOrThrow
   */
  export type ExerciseWithMetadataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseWithMetadata to fetch.
     */
    where: ExerciseWithMetadataWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseWithMetadata findFirst
   */
  export type ExerciseWithMetadataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseWithMetadata to fetch.
     */
    where?: ExerciseWithMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseWithMetadata to fetch.
     */
    orderBy?: ExerciseWithMetadataOrderByWithRelationInput | ExerciseWithMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExerciseWithMetadata.
     */
    cursor?: ExerciseWithMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseWithMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseWithMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExerciseWithMetadata.
     */
    distinct?: ExerciseWithMetadataScalarFieldEnum | ExerciseWithMetadataScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseWithMetadata findFirstOrThrow
   */
  export type ExerciseWithMetadataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseWithMetadata to fetch.
     */
    where?: ExerciseWithMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseWithMetadata to fetch.
     */
    orderBy?: ExerciseWithMetadataOrderByWithRelationInput | ExerciseWithMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExerciseWithMetadata.
     */
    cursor?: ExerciseWithMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseWithMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseWithMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExerciseWithMetadata.
     */
    distinct?: ExerciseWithMetadataScalarFieldEnum | ExerciseWithMetadataScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseWithMetadata findMany
   */
  export type ExerciseWithMetadataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseWithMetadata to fetch.
     */
    where?: ExerciseWithMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseWithMetadata to fetch.
     */
    orderBy?: ExerciseWithMetadataOrderByWithRelationInput | ExerciseWithMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExerciseWithMetadata.
     */
    cursor?: ExerciseWithMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseWithMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseWithMetadata.
     */
    skip?: number
    distinct?: ExerciseWithMetadataScalarFieldEnum | ExerciseWithMetadataScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseWithMetadata create
   */
  export type ExerciseWithMetadataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    /**
     * The data needed to create a ExerciseWithMetadata.
     */
    data: XOR<ExerciseWithMetadataCreateInput, ExerciseWithMetadataUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseWithMetadata createMany
   */
  export type ExerciseWithMetadataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExerciseWithMetadata.
     */
    data: ExerciseWithMetadataCreateManyInput | ExerciseWithMetadataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExerciseWithMetadata createManyAndReturn
   */
  export type ExerciseWithMetadataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * The data used to create many ExerciseWithMetadata.
     */
    data: ExerciseWithMetadataCreateManyInput | ExerciseWithMetadataCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExerciseWithMetadata update
   */
  export type ExerciseWithMetadataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    /**
     * The data needed to update a ExerciseWithMetadata.
     */
    data: XOR<ExerciseWithMetadataUpdateInput, ExerciseWithMetadataUncheckedUpdateInput>
    /**
     * Choose, which ExerciseWithMetadata to update.
     */
    where: ExerciseWithMetadataWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseWithMetadata updateMany
   */
  export type ExerciseWithMetadataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExerciseWithMetadata.
     */
    data: XOR<ExerciseWithMetadataUpdateManyMutationInput, ExerciseWithMetadataUncheckedUpdateManyInput>
    /**
     * Filter which ExerciseWithMetadata to update
     */
    where?: ExerciseWithMetadataWhereInput
    /**
     * Limit how many ExerciseWithMetadata to update.
     */
    limit?: number
  }

  /**
   * ExerciseWithMetadata updateManyAndReturn
   */
  export type ExerciseWithMetadataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * The data used to update ExerciseWithMetadata.
     */
    data: XOR<ExerciseWithMetadataUpdateManyMutationInput, ExerciseWithMetadataUncheckedUpdateManyInput>
    /**
     * Filter which ExerciseWithMetadata to update
     */
    where?: ExerciseWithMetadataWhereInput
    /**
     * Limit how many ExerciseWithMetadata to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExerciseWithMetadata upsert
   */
  export type ExerciseWithMetadataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    /**
     * The filter to search for the ExerciseWithMetadata to update in case it exists.
     */
    where: ExerciseWithMetadataWhereUniqueInput
    /**
     * In case the ExerciseWithMetadata found by the `where` argument doesn't exist, create a new ExerciseWithMetadata with this data.
     */
    create: XOR<ExerciseWithMetadataCreateInput, ExerciseWithMetadataUncheckedCreateInput>
    /**
     * In case the ExerciseWithMetadata was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExerciseWithMetadataUpdateInput, ExerciseWithMetadataUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseWithMetadata delete
   */
  export type ExerciseWithMetadataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    /**
     * Filter which ExerciseWithMetadata to delete.
     */
    where: ExerciseWithMetadataWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseWithMetadata deleteMany
   */
  export type ExerciseWithMetadataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExerciseWithMetadata to delete
     */
    where?: ExerciseWithMetadataWhereInput
    /**
     * Limit how many ExerciseWithMetadata to delete.
     */
    limit?: number
  }

  /**
   * ExerciseWithMetadata.sessionExerciseLogs
   */
  export type ExerciseWithMetadata$sessionExerciseLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    where?: SessionExerciseLogWhereInput
    orderBy?: SessionExerciseLogOrderByWithRelationInput | SessionExerciseLogOrderByWithRelationInput[]
    cursor?: SessionExerciseLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionExerciseLogScalarFieldEnum | SessionExerciseLogScalarFieldEnum[]
  }

  /**
   * ExerciseWithMetadata without action
   */
  export type ExerciseWithMetadataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
  }


  /**
   * Model ExerciseLog
   */

  export type AggregateExerciseLog = {
    _count: ExerciseLogCountAggregateOutputType | null
    _avg: ExerciseLogAvgAggregateOutputType | null
    _sum: ExerciseLogSumAggregateOutputType | null
    _min: ExerciseLogMinAggregateOutputType | null
    _max: ExerciseLogMaxAggregateOutputType | null
  }

  export type ExerciseLogAvgAggregateOutputType = {
    weight: number | null
    reps: number | null
    set_order_index: number | null
    rpe: number | null
  }

  export type ExerciseLogSumAggregateOutputType = {
    weight: number | null
    reps: number | null
    set_order_index: number | null
    rpe: number | null
  }

  export type ExerciseLogMinAggregateOutputType = {
    id: string | null
    weight: number | null
    reps: number | null
    set_order_index: number | null
    rpe: number | null
    date: Date | null
    pr_type: string | null
    user_id: string | null
    exerciseId: string | null
  }

  export type ExerciseLogMaxAggregateOutputType = {
    id: string | null
    weight: number | null
    reps: number | null
    set_order_index: number | null
    rpe: number | null
    date: Date | null
    pr_type: string | null
    user_id: string | null
    exerciseId: string | null
  }

  export type ExerciseLogCountAggregateOutputType = {
    id: number
    weight: number
    reps: number
    set_order_index: number
    rpe: number
    date: number
    pr_type: number
    user_id: number
    exerciseId: number
    _all: number
  }


  export type ExerciseLogAvgAggregateInputType = {
    weight?: true
    reps?: true
    set_order_index?: true
    rpe?: true
  }

  export type ExerciseLogSumAggregateInputType = {
    weight?: true
    reps?: true
    set_order_index?: true
    rpe?: true
  }

  export type ExerciseLogMinAggregateInputType = {
    id?: true
    weight?: true
    reps?: true
    set_order_index?: true
    rpe?: true
    date?: true
    pr_type?: true
    user_id?: true
    exerciseId?: true
  }

  export type ExerciseLogMaxAggregateInputType = {
    id?: true
    weight?: true
    reps?: true
    set_order_index?: true
    rpe?: true
    date?: true
    pr_type?: true
    user_id?: true
    exerciseId?: true
  }

  export type ExerciseLogCountAggregateInputType = {
    id?: true
    weight?: true
    reps?: true
    set_order_index?: true
    rpe?: true
    date?: true
    pr_type?: true
    user_id?: true
    exerciseId?: true
    _all?: true
  }

  export type ExerciseLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExerciseLog to aggregate.
     */
    where?: ExerciseLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseLogs to fetch.
     */
    orderBy?: ExerciseLogOrderByWithRelationInput | ExerciseLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExerciseLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExerciseLogs
    **/
    _count?: true | ExerciseLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExerciseLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExerciseLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExerciseLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExerciseLogMaxAggregateInputType
  }

  export type GetExerciseLogAggregateType<T extends ExerciseLogAggregateArgs> = {
        [P in keyof T & keyof AggregateExerciseLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExerciseLog[P]>
      : GetScalarType<T[P], AggregateExerciseLog[P]>
  }




  export type ExerciseLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExerciseLogWhereInput
    orderBy?: ExerciseLogOrderByWithAggregationInput | ExerciseLogOrderByWithAggregationInput[]
    by: ExerciseLogScalarFieldEnum[] | ExerciseLogScalarFieldEnum
    having?: ExerciseLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExerciseLogCountAggregateInputType | true
    _avg?: ExerciseLogAvgAggregateInputType
    _sum?: ExerciseLogSumAggregateInputType
    _min?: ExerciseLogMinAggregateInputType
    _max?: ExerciseLogMaxAggregateInputType
  }

  export type ExerciseLogGroupByOutputType = {
    id: string
    weight: number | null
    reps: number
    set_order_index: number
    rpe: number | null
    date: Date
    pr_type: string | null
    user_id: string
    exerciseId: string | null
    _count: ExerciseLogCountAggregateOutputType | null
    _avg: ExerciseLogAvgAggregateOutputType | null
    _sum: ExerciseLogSumAggregateOutputType | null
    _min: ExerciseLogMinAggregateOutputType | null
    _max: ExerciseLogMaxAggregateOutputType | null
  }

  type GetExerciseLogGroupByPayload<T extends ExerciseLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExerciseLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExerciseLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExerciseLogGroupByOutputType[P]>
            : GetScalarType<T[P], ExerciseLogGroupByOutputType[P]>
        }
      >
    >


  export type ExerciseLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weight?: boolean
    reps?: boolean
    set_order_index?: boolean
    rpe?: boolean
    date?: boolean
    pr_type?: boolean
    user_id?: boolean
    exerciseId?: boolean
    sessionExerciseLog?: boolean | ExerciseLog$sessionExerciseLogArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    exercise?: boolean | ExerciseLog$exerciseArgs<ExtArgs>
  }, ExtArgs["result"]["exerciseLog"]>

  export type ExerciseLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weight?: boolean
    reps?: boolean
    set_order_index?: boolean
    rpe?: boolean
    date?: boolean
    pr_type?: boolean
    user_id?: boolean
    exerciseId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    exercise?: boolean | ExerciseLog$exerciseArgs<ExtArgs>
  }, ExtArgs["result"]["exerciseLog"]>

  export type ExerciseLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weight?: boolean
    reps?: boolean
    set_order_index?: boolean
    rpe?: boolean
    date?: boolean
    pr_type?: boolean
    user_id?: boolean
    exerciseId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    exercise?: boolean | ExerciseLog$exerciseArgs<ExtArgs>
  }, ExtArgs["result"]["exerciseLog"]>

  export type ExerciseLogSelectScalar = {
    id?: boolean
    weight?: boolean
    reps?: boolean
    set_order_index?: boolean
    rpe?: boolean
    date?: boolean
    pr_type?: boolean
    user_id?: boolean
    exerciseId?: boolean
  }

  export type ExerciseLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "weight" | "reps" | "set_order_index" | "rpe" | "date" | "pr_type" | "user_id" | "exerciseId", ExtArgs["result"]["exerciseLog"]>
  export type ExerciseLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessionExerciseLog?: boolean | ExerciseLog$sessionExerciseLogArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    exercise?: boolean | ExerciseLog$exerciseArgs<ExtArgs>
  }
  export type ExerciseLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    exercise?: boolean | ExerciseLog$exerciseArgs<ExtArgs>
  }
  export type ExerciseLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    exercise?: boolean | ExerciseLog$exerciseArgs<ExtArgs>
  }

  export type $ExerciseLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExerciseLog"
    objects: {
      sessionExerciseLog: Prisma.$SessionExerciseLogPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs>
      exercise: Prisma.$ExercisePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weight: number | null
      reps: number
      set_order_index: number
      rpe: number | null
      date: Date
      pr_type: string | null
      user_id: string
      exerciseId: string | null
    }, ExtArgs["result"]["exerciseLog"]>
    composites: {}
  }

  type ExerciseLogGetPayload<S extends boolean | null | undefined | ExerciseLogDefaultArgs> = $Result.GetResult<Prisma.$ExerciseLogPayload, S>

  type ExerciseLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExerciseLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: ExerciseLogCountAggregateInputType | true
    }

  export interface ExerciseLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExerciseLog'], meta: { name: 'ExerciseLog' } }
    /**
     * Find zero or one ExerciseLog that matches the filter.
     * @param {ExerciseLogFindUniqueArgs} args - Arguments to find a ExerciseLog
     * @example
     * // Get one ExerciseLog
     * const exerciseLog = await prisma.exerciseLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExerciseLogFindUniqueArgs>(args: SelectSubset<T, ExerciseLogFindUniqueArgs<ExtArgs>>): Prisma__ExerciseLogClient<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExerciseLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExerciseLogFindUniqueOrThrowArgs} args - Arguments to find a ExerciseLog
     * @example
     * // Get one ExerciseLog
     * const exerciseLog = await prisma.exerciseLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExerciseLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ExerciseLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExerciseLogClient<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExerciseLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseLogFindFirstArgs} args - Arguments to find a ExerciseLog
     * @example
     * // Get one ExerciseLog
     * const exerciseLog = await prisma.exerciseLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExerciseLogFindFirstArgs>(args?: SelectSubset<T, ExerciseLogFindFirstArgs<ExtArgs>>): Prisma__ExerciseLogClient<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExerciseLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseLogFindFirstOrThrowArgs} args - Arguments to find a ExerciseLog
     * @example
     * // Get one ExerciseLog
     * const exerciseLog = await prisma.exerciseLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExerciseLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ExerciseLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExerciseLogClient<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExerciseLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExerciseLogs
     * const exerciseLogs = await prisma.exerciseLog.findMany()
     * 
     * // Get first 10 ExerciseLogs
     * const exerciseLogs = await prisma.exerciseLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exerciseLogWithIdOnly = await prisma.exerciseLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExerciseLogFindManyArgs>(args?: SelectSubset<T, ExerciseLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExerciseLog.
     * @param {ExerciseLogCreateArgs} args - Arguments to create a ExerciseLog.
     * @example
     * // Create one ExerciseLog
     * const ExerciseLog = await prisma.exerciseLog.create({
     *   data: {
     *     // ... data to create a ExerciseLog
     *   }
     * })
     * 
     */
    create<T extends ExerciseLogCreateArgs>(args: SelectSubset<T, ExerciseLogCreateArgs<ExtArgs>>): Prisma__ExerciseLogClient<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExerciseLogs.
     * @param {ExerciseLogCreateManyArgs} args - Arguments to create many ExerciseLogs.
     * @example
     * // Create many ExerciseLogs
     * const exerciseLog = await prisma.exerciseLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExerciseLogCreateManyArgs>(args?: SelectSubset<T, ExerciseLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExerciseLogs and returns the data saved in the database.
     * @param {ExerciseLogCreateManyAndReturnArgs} args - Arguments to create many ExerciseLogs.
     * @example
     * // Create many ExerciseLogs
     * const exerciseLog = await prisma.exerciseLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExerciseLogs and only return the `id`
     * const exerciseLogWithIdOnly = await prisma.exerciseLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExerciseLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ExerciseLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExerciseLog.
     * @param {ExerciseLogDeleteArgs} args - Arguments to delete one ExerciseLog.
     * @example
     * // Delete one ExerciseLog
     * const ExerciseLog = await prisma.exerciseLog.delete({
     *   where: {
     *     // ... filter to delete one ExerciseLog
     *   }
     * })
     * 
     */
    delete<T extends ExerciseLogDeleteArgs>(args: SelectSubset<T, ExerciseLogDeleteArgs<ExtArgs>>): Prisma__ExerciseLogClient<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExerciseLog.
     * @param {ExerciseLogUpdateArgs} args - Arguments to update one ExerciseLog.
     * @example
     * // Update one ExerciseLog
     * const exerciseLog = await prisma.exerciseLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExerciseLogUpdateArgs>(args: SelectSubset<T, ExerciseLogUpdateArgs<ExtArgs>>): Prisma__ExerciseLogClient<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExerciseLogs.
     * @param {ExerciseLogDeleteManyArgs} args - Arguments to filter ExerciseLogs to delete.
     * @example
     * // Delete a few ExerciseLogs
     * const { count } = await prisma.exerciseLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExerciseLogDeleteManyArgs>(args?: SelectSubset<T, ExerciseLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExerciseLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExerciseLogs
     * const exerciseLog = await prisma.exerciseLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExerciseLogUpdateManyArgs>(args: SelectSubset<T, ExerciseLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExerciseLogs and returns the data updated in the database.
     * @param {ExerciseLogUpdateManyAndReturnArgs} args - Arguments to update many ExerciseLogs.
     * @example
     * // Update many ExerciseLogs
     * const exerciseLog = await prisma.exerciseLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExerciseLogs and only return the `id`
     * const exerciseLogWithIdOnly = await prisma.exerciseLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExerciseLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ExerciseLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExerciseLog.
     * @param {ExerciseLogUpsertArgs} args - Arguments to update or create a ExerciseLog.
     * @example
     * // Update or create a ExerciseLog
     * const exerciseLog = await prisma.exerciseLog.upsert({
     *   create: {
     *     // ... data to create a ExerciseLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExerciseLog we want to update
     *   }
     * })
     */
    upsert<T extends ExerciseLogUpsertArgs>(args: SelectSubset<T, ExerciseLogUpsertArgs<ExtArgs>>): Prisma__ExerciseLogClient<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExerciseLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseLogCountArgs} args - Arguments to filter ExerciseLogs to count.
     * @example
     * // Count the number of ExerciseLogs
     * const count = await prisma.exerciseLog.count({
     *   where: {
     *     // ... the filter for the ExerciseLogs we want to count
     *   }
     * })
    **/
    count<T extends ExerciseLogCountArgs>(
      args?: Subset<T, ExerciseLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExerciseLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExerciseLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExerciseLogAggregateArgs>(args: Subset<T, ExerciseLogAggregateArgs>): Prisma.PrismaPromise<GetExerciseLogAggregateType<T>>

    /**
     * Group by ExerciseLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExerciseLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExerciseLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExerciseLogGroupByArgs['orderBy'] }
        : { orderBy?: ExerciseLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExerciseLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExerciseLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExerciseLog model
   */
  readonly fields: ExerciseLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExerciseLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExerciseLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessionExerciseLog<T extends ExerciseLog$sessionExerciseLogArgs<ExtArgs> = {}>(args?: Subset<T, ExerciseLog$sessionExerciseLogArgs<ExtArgs>>): Prisma__SessionExerciseLogClient<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    exercise<T extends ExerciseLog$exerciseArgs<ExtArgs> = {}>(args?: Subset<T, ExerciseLog$exerciseArgs<ExtArgs>>): Prisma__ExerciseClient<$Result.GetResult<Prisma.$ExercisePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExerciseLog model
   */
  interface ExerciseLogFieldRefs {
    readonly id: FieldRef<"ExerciseLog", 'String'>
    readonly weight: FieldRef<"ExerciseLog", 'Float'>
    readonly reps: FieldRef<"ExerciseLog", 'Int'>
    readonly set_order_index: FieldRef<"ExerciseLog", 'Int'>
    readonly rpe: FieldRef<"ExerciseLog", 'Float'>
    readonly date: FieldRef<"ExerciseLog", 'DateTime'>
    readonly pr_type: FieldRef<"ExerciseLog", 'String'>
    readonly user_id: FieldRef<"ExerciseLog", 'String'>
    readonly exerciseId: FieldRef<"ExerciseLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ExerciseLog findUnique
   */
  export type ExerciseLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseLog to fetch.
     */
    where: ExerciseLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseLog findUniqueOrThrow
   */
  export type ExerciseLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseLog to fetch.
     */
    where: ExerciseLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseLog findFirst
   */
  export type ExerciseLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseLog to fetch.
     */
    where?: ExerciseLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseLogs to fetch.
     */
    orderBy?: ExerciseLogOrderByWithRelationInput | ExerciseLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExerciseLogs.
     */
    cursor?: ExerciseLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExerciseLogs.
     */
    distinct?: ExerciseLogScalarFieldEnum | ExerciseLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseLog findFirstOrThrow
   */
  export type ExerciseLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseLog to fetch.
     */
    where?: ExerciseLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseLogs to fetch.
     */
    orderBy?: ExerciseLogOrderByWithRelationInput | ExerciseLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExerciseLogs.
     */
    cursor?: ExerciseLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExerciseLogs.
     */
    distinct?: ExerciseLogScalarFieldEnum | ExerciseLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseLog findMany
   */
  export type ExerciseLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which ExerciseLogs to fetch.
     */
    where?: ExerciseLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExerciseLogs to fetch.
     */
    orderBy?: ExerciseLogOrderByWithRelationInput | ExerciseLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExerciseLogs.
     */
    cursor?: ExerciseLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExerciseLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExerciseLogs.
     */
    skip?: number
    distinct?: ExerciseLogScalarFieldEnum | ExerciseLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseLog create
   */
  export type ExerciseLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ExerciseLog.
     */
    data: XOR<ExerciseLogCreateInput, ExerciseLogUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseLog createMany
   */
  export type ExerciseLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExerciseLogs.
     */
    data: ExerciseLogCreateManyInput | ExerciseLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExerciseLog createManyAndReturn
   */
  export type ExerciseLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * The data used to create many ExerciseLogs.
     */
    data: ExerciseLogCreateManyInput | ExerciseLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExerciseLog update
   */
  export type ExerciseLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ExerciseLog.
     */
    data: XOR<ExerciseLogUpdateInput, ExerciseLogUncheckedUpdateInput>
    /**
     * Choose, which ExerciseLog to update.
     */
    where: ExerciseLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseLog updateMany
   */
  export type ExerciseLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExerciseLogs.
     */
    data: XOR<ExerciseLogUpdateManyMutationInput, ExerciseLogUncheckedUpdateManyInput>
    /**
     * Filter which ExerciseLogs to update
     */
    where?: ExerciseLogWhereInput
    /**
     * Limit how many ExerciseLogs to update.
     */
    limit?: number
  }

  /**
   * ExerciseLog updateManyAndReturn
   */
  export type ExerciseLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * The data used to update ExerciseLogs.
     */
    data: XOR<ExerciseLogUpdateManyMutationInput, ExerciseLogUncheckedUpdateManyInput>
    /**
     * Filter which ExerciseLogs to update
     */
    where?: ExerciseLogWhereInput
    /**
     * Limit how many ExerciseLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExerciseLog upsert
   */
  export type ExerciseLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ExerciseLog to update in case it exists.
     */
    where: ExerciseLogWhereUniqueInput
    /**
     * In case the ExerciseLog found by the `where` argument doesn't exist, create a new ExerciseLog with this data.
     */
    create: XOR<ExerciseLogCreateInput, ExerciseLogUncheckedCreateInput>
    /**
     * In case the ExerciseLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExerciseLogUpdateInput, ExerciseLogUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseLog delete
   */
  export type ExerciseLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    /**
     * Filter which ExerciseLog to delete.
     */
    where: ExerciseLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExerciseLog deleteMany
   */
  export type ExerciseLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExerciseLogs to delete
     */
    where?: ExerciseLogWhereInput
    /**
     * Limit how many ExerciseLogs to delete.
     */
    limit?: number
  }

  /**
   * ExerciseLog.sessionExerciseLog
   */
  export type ExerciseLog$sessionExerciseLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    where?: SessionExerciseLogWhereInput
  }

  /**
   * ExerciseLog.exercise
   */
  export type ExerciseLog$exerciseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Exercise
     */
    select?: ExerciseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Exercise
     */
    omit?: ExerciseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseInclude<ExtArgs> | null
    where?: ExerciseWhereInput
  }

  /**
   * ExerciseLog without action
   */
  export type ExerciseLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
  }


  /**
   * Model SessionExerciseLog
   */

  export type AggregateSessionExerciseLog = {
    _count: SessionExerciseLogCountAggregateOutputType | null
    _min: SessionExerciseLogMinAggregateOutputType | null
    _max: SessionExerciseLogMaxAggregateOutputType | null
  }

  export type SessionExerciseLogMinAggregateOutputType = {
    id: string | null
    notes: string | null
    workout_session_id: string | null
    exercise_with_metadata_id: string | null
    user_id: string | null
    exercise_log_id: string | null
  }

  export type SessionExerciseLogMaxAggregateOutputType = {
    id: string | null
    notes: string | null
    workout_session_id: string | null
    exercise_with_metadata_id: string | null
    user_id: string | null
    exercise_log_id: string | null
  }

  export type SessionExerciseLogCountAggregateOutputType = {
    id: number
    notes: number
    workout_session_id: number
    exercise_with_metadata_id: number
    user_id: number
    exercise_log_id: number
    _all: number
  }


  export type SessionExerciseLogMinAggregateInputType = {
    id?: true
    notes?: true
    workout_session_id?: true
    exercise_with_metadata_id?: true
    user_id?: true
    exercise_log_id?: true
  }

  export type SessionExerciseLogMaxAggregateInputType = {
    id?: true
    notes?: true
    workout_session_id?: true
    exercise_with_metadata_id?: true
    user_id?: true
    exercise_log_id?: true
  }

  export type SessionExerciseLogCountAggregateInputType = {
    id?: true
    notes?: true
    workout_session_id?: true
    exercise_with_metadata_id?: true
    user_id?: true
    exercise_log_id?: true
    _all?: true
  }

  export type SessionExerciseLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SessionExerciseLog to aggregate.
     */
    where?: SessionExerciseLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionExerciseLogs to fetch.
     */
    orderBy?: SessionExerciseLogOrderByWithRelationInput | SessionExerciseLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionExerciseLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionExerciseLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionExerciseLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SessionExerciseLogs
    **/
    _count?: true | SessionExerciseLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionExerciseLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionExerciseLogMaxAggregateInputType
  }

  export type GetSessionExerciseLogAggregateType<T extends SessionExerciseLogAggregateArgs> = {
        [P in keyof T & keyof AggregateSessionExerciseLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSessionExerciseLog[P]>
      : GetScalarType<T[P], AggregateSessionExerciseLog[P]>
  }




  export type SessionExerciseLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionExerciseLogWhereInput
    orderBy?: SessionExerciseLogOrderByWithAggregationInput | SessionExerciseLogOrderByWithAggregationInput[]
    by: SessionExerciseLogScalarFieldEnum[] | SessionExerciseLogScalarFieldEnum
    having?: SessionExerciseLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionExerciseLogCountAggregateInputType | true
    _min?: SessionExerciseLogMinAggregateInputType
    _max?: SessionExerciseLogMaxAggregateInputType
  }

  export type SessionExerciseLogGroupByOutputType = {
    id: string
    notes: string | null
    workout_session_id: string
    exercise_with_metadata_id: string | null
    user_id: string
    exercise_log_id: string | null
    _count: SessionExerciseLogCountAggregateOutputType | null
    _min: SessionExerciseLogMinAggregateOutputType | null
    _max: SessionExerciseLogMaxAggregateOutputType | null
  }

  type GetSessionExerciseLogGroupByPayload<T extends SessionExerciseLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionExerciseLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionExerciseLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionExerciseLogGroupByOutputType[P]>
            : GetScalarType<T[P], SessionExerciseLogGroupByOutputType[P]>
        }
      >
    >


  export type SessionExerciseLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    notes?: boolean
    workout_session_id?: boolean
    exercise_with_metadata_id?: boolean
    user_id?: boolean
    exercise_log_id?: boolean
    workoutSession?: boolean | WorkoutSessionDefaultArgs<ExtArgs>
    exerciseWithMetadata?: boolean | SessionExerciseLog$exerciseWithMetadataArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    exerciseLog?: boolean | SessionExerciseLog$exerciseLogArgs<ExtArgs>
  }, ExtArgs["result"]["sessionExerciseLog"]>

  export type SessionExerciseLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    notes?: boolean
    workout_session_id?: boolean
    exercise_with_metadata_id?: boolean
    user_id?: boolean
    exercise_log_id?: boolean
    workoutSession?: boolean | WorkoutSessionDefaultArgs<ExtArgs>
    exerciseWithMetadata?: boolean | SessionExerciseLog$exerciseWithMetadataArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    exerciseLog?: boolean | SessionExerciseLog$exerciseLogArgs<ExtArgs>
  }, ExtArgs["result"]["sessionExerciseLog"]>

  export type SessionExerciseLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    notes?: boolean
    workout_session_id?: boolean
    exercise_with_metadata_id?: boolean
    user_id?: boolean
    exercise_log_id?: boolean
    workoutSession?: boolean | WorkoutSessionDefaultArgs<ExtArgs>
    exerciseWithMetadata?: boolean | SessionExerciseLog$exerciseWithMetadataArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    exerciseLog?: boolean | SessionExerciseLog$exerciseLogArgs<ExtArgs>
  }, ExtArgs["result"]["sessionExerciseLog"]>

  export type SessionExerciseLogSelectScalar = {
    id?: boolean
    notes?: boolean
    workout_session_id?: boolean
    exercise_with_metadata_id?: boolean
    user_id?: boolean
    exercise_log_id?: boolean
  }

  export type SessionExerciseLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "notes" | "workout_session_id" | "exercise_with_metadata_id" | "user_id" | "exercise_log_id", ExtArgs["result"]["sessionExerciseLog"]>
  export type SessionExerciseLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workoutSession?: boolean | WorkoutSessionDefaultArgs<ExtArgs>
    exerciseWithMetadata?: boolean | SessionExerciseLog$exerciseWithMetadataArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    exerciseLog?: boolean | SessionExerciseLog$exerciseLogArgs<ExtArgs>
  }
  export type SessionExerciseLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workoutSession?: boolean | WorkoutSessionDefaultArgs<ExtArgs>
    exerciseWithMetadata?: boolean | SessionExerciseLog$exerciseWithMetadataArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    exerciseLog?: boolean | SessionExerciseLog$exerciseLogArgs<ExtArgs>
  }
  export type SessionExerciseLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workoutSession?: boolean | WorkoutSessionDefaultArgs<ExtArgs>
    exerciseWithMetadata?: boolean | SessionExerciseLog$exerciseWithMetadataArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    exerciseLog?: boolean | SessionExerciseLog$exerciseLogArgs<ExtArgs>
  }

  export type $SessionExerciseLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SessionExerciseLog"
    objects: {
      workoutSession: Prisma.$WorkoutSessionPayload<ExtArgs>
      exerciseWithMetadata: Prisma.$ExerciseWithMetadataPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs>
      exerciseLog: Prisma.$ExerciseLogPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      notes: string | null
      workout_session_id: string
      exercise_with_metadata_id: string | null
      user_id: string
      exercise_log_id: string | null
    }, ExtArgs["result"]["sessionExerciseLog"]>
    composites: {}
  }

  type SessionExerciseLogGetPayload<S extends boolean | null | undefined | SessionExerciseLogDefaultArgs> = $Result.GetResult<Prisma.$SessionExerciseLogPayload, S>

  type SessionExerciseLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionExerciseLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: SessionExerciseLogCountAggregateInputType | true
    }

  export interface SessionExerciseLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SessionExerciseLog'], meta: { name: 'SessionExerciseLog' } }
    /**
     * Find zero or one SessionExerciseLog that matches the filter.
     * @param {SessionExerciseLogFindUniqueArgs} args - Arguments to find a SessionExerciseLog
     * @example
     * // Get one SessionExerciseLog
     * const sessionExerciseLog = await prisma.sessionExerciseLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionExerciseLogFindUniqueArgs>(args: SelectSubset<T, SessionExerciseLogFindUniqueArgs<ExtArgs>>): Prisma__SessionExerciseLogClient<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SessionExerciseLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionExerciseLogFindUniqueOrThrowArgs} args - Arguments to find a SessionExerciseLog
     * @example
     * // Get one SessionExerciseLog
     * const sessionExerciseLog = await prisma.sessionExerciseLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionExerciseLogFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionExerciseLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionExerciseLogClient<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SessionExerciseLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionExerciseLogFindFirstArgs} args - Arguments to find a SessionExerciseLog
     * @example
     * // Get one SessionExerciseLog
     * const sessionExerciseLog = await prisma.sessionExerciseLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionExerciseLogFindFirstArgs>(args?: SelectSubset<T, SessionExerciseLogFindFirstArgs<ExtArgs>>): Prisma__SessionExerciseLogClient<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SessionExerciseLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionExerciseLogFindFirstOrThrowArgs} args - Arguments to find a SessionExerciseLog
     * @example
     * // Get one SessionExerciseLog
     * const sessionExerciseLog = await prisma.sessionExerciseLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionExerciseLogFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionExerciseLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionExerciseLogClient<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SessionExerciseLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionExerciseLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SessionExerciseLogs
     * const sessionExerciseLogs = await prisma.sessionExerciseLog.findMany()
     * 
     * // Get first 10 SessionExerciseLogs
     * const sessionExerciseLogs = await prisma.sessionExerciseLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionExerciseLogWithIdOnly = await prisma.sessionExerciseLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionExerciseLogFindManyArgs>(args?: SelectSubset<T, SessionExerciseLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SessionExerciseLog.
     * @param {SessionExerciseLogCreateArgs} args - Arguments to create a SessionExerciseLog.
     * @example
     * // Create one SessionExerciseLog
     * const SessionExerciseLog = await prisma.sessionExerciseLog.create({
     *   data: {
     *     // ... data to create a SessionExerciseLog
     *   }
     * })
     * 
     */
    create<T extends SessionExerciseLogCreateArgs>(args: SelectSubset<T, SessionExerciseLogCreateArgs<ExtArgs>>): Prisma__SessionExerciseLogClient<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SessionExerciseLogs.
     * @param {SessionExerciseLogCreateManyArgs} args - Arguments to create many SessionExerciseLogs.
     * @example
     * // Create many SessionExerciseLogs
     * const sessionExerciseLog = await prisma.sessionExerciseLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionExerciseLogCreateManyArgs>(args?: SelectSubset<T, SessionExerciseLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SessionExerciseLogs and returns the data saved in the database.
     * @param {SessionExerciseLogCreateManyAndReturnArgs} args - Arguments to create many SessionExerciseLogs.
     * @example
     * // Create many SessionExerciseLogs
     * const sessionExerciseLog = await prisma.sessionExerciseLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SessionExerciseLogs and only return the `id`
     * const sessionExerciseLogWithIdOnly = await prisma.sessionExerciseLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionExerciseLogCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionExerciseLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SessionExerciseLog.
     * @param {SessionExerciseLogDeleteArgs} args - Arguments to delete one SessionExerciseLog.
     * @example
     * // Delete one SessionExerciseLog
     * const SessionExerciseLog = await prisma.sessionExerciseLog.delete({
     *   where: {
     *     // ... filter to delete one SessionExerciseLog
     *   }
     * })
     * 
     */
    delete<T extends SessionExerciseLogDeleteArgs>(args: SelectSubset<T, SessionExerciseLogDeleteArgs<ExtArgs>>): Prisma__SessionExerciseLogClient<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SessionExerciseLog.
     * @param {SessionExerciseLogUpdateArgs} args - Arguments to update one SessionExerciseLog.
     * @example
     * // Update one SessionExerciseLog
     * const sessionExerciseLog = await prisma.sessionExerciseLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionExerciseLogUpdateArgs>(args: SelectSubset<T, SessionExerciseLogUpdateArgs<ExtArgs>>): Prisma__SessionExerciseLogClient<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SessionExerciseLogs.
     * @param {SessionExerciseLogDeleteManyArgs} args - Arguments to filter SessionExerciseLogs to delete.
     * @example
     * // Delete a few SessionExerciseLogs
     * const { count } = await prisma.sessionExerciseLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionExerciseLogDeleteManyArgs>(args?: SelectSubset<T, SessionExerciseLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SessionExerciseLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionExerciseLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SessionExerciseLogs
     * const sessionExerciseLog = await prisma.sessionExerciseLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionExerciseLogUpdateManyArgs>(args: SelectSubset<T, SessionExerciseLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SessionExerciseLogs and returns the data updated in the database.
     * @param {SessionExerciseLogUpdateManyAndReturnArgs} args - Arguments to update many SessionExerciseLogs.
     * @example
     * // Update many SessionExerciseLogs
     * const sessionExerciseLog = await prisma.sessionExerciseLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SessionExerciseLogs and only return the `id`
     * const sessionExerciseLogWithIdOnly = await prisma.sessionExerciseLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionExerciseLogUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionExerciseLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SessionExerciseLog.
     * @param {SessionExerciseLogUpsertArgs} args - Arguments to update or create a SessionExerciseLog.
     * @example
     * // Update or create a SessionExerciseLog
     * const sessionExerciseLog = await prisma.sessionExerciseLog.upsert({
     *   create: {
     *     // ... data to create a SessionExerciseLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SessionExerciseLog we want to update
     *   }
     * })
     */
    upsert<T extends SessionExerciseLogUpsertArgs>(args: SelectSubset<T, SessionExerciseLogUpsertArgs<ExtArgs>>): Prisma__SessionExerciseLogClient<$Result.GetResult<Prisma.$SessionExerciseLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SessionExerciseLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionExerciseLogCountArgs} args - Arguments to filter SessionExerciseLogs to count.
     * @example
     * // Count the number of SessionExerciseLogs
     * const count = await prisma.sessionExerciseLog.count({
     *   where: {
     *     // ... the filter for the SessionExerciseLogs we want to count
     *   }
     * })
    **/
    count<T extends SessionExerciseLogCountArgs>(
      args?: Subset<T, SessionExerciseLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionExerciseLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SessionExerciseLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionExerciseLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionExerciseLogAggregateArgs>(args: Subset<T, SessionExerciseLogAggregateArgs>): Prisma.PrismaPromise<GetSessionExerciseLogAggregateType<T>>

    /**
     * Group by SessionExerciseLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionExerciseLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionExerciseLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionExerciseLogGroupByArgs['orderBy'] }
        : { orderBy?: SessionExerciseLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionExerciseLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionExerciseLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SessionExerciseLog model
   */
  readonly fields: SessionExerciseLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SessionExerciseLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionExerciseLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workoutSession<T extends WorkoutSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkoutSessionDefaultArgs<ExtArgs>>): Prisma__WorkoutSessionClient<$Result.GetResult<Prisma.$WorkoutSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    exerciseWithMetadata<T extends SessionExerciseLog$exerciseWithMetadataArgs<ExtArgs> = {}>(args?: Subset<T, SessionExerciseLog$exerciseWithMetadataArgs<ExtArgs>>): Prisma__ExerciseWithMetadataClient<$Result.GetResult<Prisma.$ExerciseWithMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    exerciseLog<T extends SessionExerciseLog$exerciseLogArgs<ExtArgs> = {}>(args?: Subset<T, SessionExerciseLog$exerciseLogArgs<ExtArgs>>): Prisma__ExerciseLogClient<$Result.GetResult<Prisma.$ExerciseLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SessionExerciseLog model
   */
  interface SessionExerciseLogFieldRefs {
    readonly id: FieldRef<"SessionExerciseLog", 'String'>
    readonly notes: FieldRef<"SessionExerciseLog", 'String'>
    readonly workout_session_id: FieldRef<"SessionExerciseLog", 'String'>
    readonly exercise_with_metadata_id: FieldRef<"SessionExerciseLog", 'String'>
    readonly user_id: FieldRef<"SessionExerciseLog", 'String'>
    readonly exercise_log_id: FieldRef<"SessionExerciseLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SessionExerciseLog findUnique
   */
  export type SessionExerciseLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which SessionExerciseLog to fetch.
     */
    where: SessionExerciseLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * SessionExerciseLog findUniqueOrThrow
   */
  export type SessionExerciseLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which SessionExerciseLog to fetch.
     */
    where: SessionExerciseLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * SessionExerciseLog findFirst
   */
  export type SessionExerciseLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which SessionExerciseLog to fetch.
     */
    where?: SessionExerciseLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionExerciseLogs to fetch.
     */
    orderBy?: SessionExerciseLogOrderByWithRelationInput | SessionExerciseLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SessionExerciseLogs.
     */
    cursor?: SessionExerciseLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionExerciseLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionExerciseLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SessionExerciseLogs.
     */
    distinct?: SessionExerciseLogScalarFieldEnum | SessionExerciseLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * SessionExerciseLog findFirstOrThrow
   */
  export type SessionExerciseLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which SessionExerciseLog to fetch.
     */
    where?: SessionExerciseLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionExerciseLogs to fetch.
     */
    orderBy?: SessionExerciseLogOrderByWithRelationInput | SessionExerciseLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SessionExerciseLogs.
     */
    cursor?: SessionExerciseLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionExerciseLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionExerciseLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SessionExerciseLogs.
     */
    distinct?: SessionExerciseLogScalarFieldEnum | SessionExerciseLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * SessionExerciseLog findMany
   */
  export type SessionExerciseLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    /**
     * Filter, which SessionExerciseLogs to fetch.
     */
    where?: SessionExerciseLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionExerciseLogs to fetch.
     */
    orderBy?: SessionExerciseLogOrderByWithRelationInput | SessionExerciseLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SessionExerciseLogs.
     */
    cursor?: SessionExerciseLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionExerciseLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionExerciseLogs.
     */
    skip?: number
    distinct?: SessionExerciseLogScalarFieldEnum | SessionExerciseLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * SessionExerciseLog create
   */
  export type SessionExerciseLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    /**
     * The data needed to create a SessionExerciseLog.
     */
    data: XOR<SessionExerciseLogCreateInput, SessionExerciseLogUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * SessionExerciseLog createMany
   */
  export type SessionExerciseLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SessionExerciseLogs.
     */
    data: SessionExerciseLogCreateManyInput | SessionExerciseLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SessionExerciseLog createManyAndReturn
   */
  export type SessionExerciseLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * The data used to create many SessionExerciseLogs.
     */
    data: SessionExerciseLogCreateManyInput | SessionExerciseLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SessionExerciseLog update
   */
  export type SessionExerciseLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    /**
     * The data needed to update a SessionExerciseLog.
     */
    data: XOR<SessionExerciseLogUpdateInput, SessionExerciseLogUncheckedUpdateInput>
    /**
     * Choose, which SessionExerciseLog to update.
     */
    where: SessionExerciseLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * SessionExerciseLog updateMany
   */
  export type SessionExerciseLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SessionExerciseLogs.
     */
    data: XOR<SessionExerciseLogUpdateManyMutationInput, SessionExerciseLogUncheckedUpdateManyInput>
    /**
     * Filter which SessionExerciseLogs to update
     */
    where?: SessionExerciseLogWhereInput
    /**
     * Limit how many SessionExerciseLogs to update.
     */
    limit?: number
  }

  /**
   * SessionExerciseLog updateManyAndReturn
   */
  export type SessionExerciseLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * The data used to update SessionExerciseLogs.
     */
    data: XOR<SessionExerciseLogUpdateManyMutationInput, SessionExerciseLogUncheckedUpdateManyInput>
    /**
     * Filter which SessionExerciseLogs to update
     */
    where?: SessionExerciseLogWhereInput
    /**
     * Limit how many SessionExerciseLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SessionExerciseLog upsert
   */
  export type SessionExerciseLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    /**
     * The filter to search for the SessionExerciseLog to update in case it exists.
     */
    where: SessionExerciseLogWhereUniqueInput
    /**
     * In case the SessionExerciseLog found by the `where` argument doesn't exist, create a new SessionExerciseLog with this data.
     */
    create: XOR<SessionExerciseLogCreateInput, SessionExerciseLogUncheckedCreateInput>
    /**
     * In case the SessionExerciseLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionExerciseLogUpdateInput, SessionExerciseLogUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * SessionExerciseLog delete
   */
  export type SessionExerciseLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
    /**
     * Filter which SessionExerciseLog to delete.
     */
    where: SessionExerciseLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * SessionExerciseLog deleteMany
   */
  export type SessionExerciseLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SessionExerciseLogs to delete
     */
    where?: SessionExerciseLogWhereInput
    /**
     * Limit how many SessionExerciseLogs to delete.
     */
    limit?: number
  }

  /**
   * SessionExerciseLog.exerciseWithMetadata
   */
  export type SessionExerciseLog$exerciseWithMetadataArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseWithMetadata
     */
    select?: ExerciseWithMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseWithMetadata
     */
    omit?: ExerciseWithMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseWithMetadataInclude<ExtArgs> | null
    where?: ExerciseWithMetadataWhereInput
  }

  /**
   * SessionExerciseLog.exerciseLog
   */
  export type SessionExerciseLog$exerciseLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExerciseLog
     */
    select?: ExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExerciseLog
     */
    omit?: ExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExerciseLogInclude<ExtArgs> | null
    where?: ExerciseLogWhereInput
  }

  /**
   * SessionExerciseLog without action
   */
  export type SessionExerciseLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionExerciseLog
     */
    select?: SessionExerciseLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SessionExerciseLog
     */
    omit?: SessionExerciseLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionExerciseLogInclude<ExtArgs> | null
  }


  /**
   * Model exercise_analytics_view
   */

  export type AggregateExercise_analytics_view = {
    _count: Exercise_analytics_viewCountAggregateOutputType | null
    _avg: Exercise_analytics_viewAvgAggregateOutputType | null
    _sum: Exercise_analytics_viewSumAggregateOutputType | null
    _min: Exercise_analytics_viewMinAggregateOutputType | null
    _max: Exercise_analytics_viewMaxAggregateOutputType | null
  }

  export type Exercise_analytics_viewAvgAggregateOutputType = {
    reps_min: number | null
    reps_max: number | null
    sets_min: number | null
    sets_max: number | null
    rest_min: number | null
    rest_max: number | null
    prescribed_order: number | null
    weight: number | null
    reps: number | null
    set_order_index: number | null
    volume: number | null
  }

  export type Exercise_analytics_viewSumAggregateOutputType = {
    reps_min: number | null
    reps_max: number | null
    sets_min: number | null
    sets_max: number | null
    rest_min: number | null
    rest_max: number | null
    prescribed_order: number | null
    weight: number | null
    reps: number | null
    set_order_index: number | null
    volume: number | null
  }

  export type Exercise_analytics_viewMinAggregateOutputType = {
    log_id: string | null
    workout_session_id: string | null
    user_id: string | null
    session_date: Date | null
    start_time: Date | null
    end_time: Date | null
    workout_id: string | null
    workout_name: string | null
    programme_id: string | null
    programme_name: string | null
    exercise_id: string | null
    exercise_name: string | null
    muscle_group: $Enums.MuscleGroup | null
    exercise_with_metadata_id: string | null
    reps_min: number | null
    reps_max: number | null
    sets_min: number | null
    sets_max: number | null
    rest_min: number | null
    rest_max: number | null
    tempo: string | null
    prescribed_order: number | null
    weight: number | null
    reps: number | null
    set_order_index: number | null
    volume: number | null
    is_ad_hoc_exercise: boolean | null
  }

  export type Exercise_analytics_viewMaxAggregateOutputType = {
    log_id: string | null
    workout_session_id: string | null
    user_id: string | null
    session_date: Date | null
    start_time: Date | null
    end_time: Date | null
    workout_id: string | null
    workout_name: string | null
    programme_id: string | null
    programme_name: string | null
    exercise_id: string | null
    exercise_name: string | null
    muscle_group: $Enums.MuscleGroup | null
    exercise_with_metadata_id: string | null
    reps_min: number | null
    reps_max: number | null
    sets_min: number | null
    sets_max: number | null
    rest_min: number | null
    rest_max: number | null
    tempo: string | null
    prescribed_order: number | null
    weight: number | null
    reps: number | null
    set_order_index: number | null
    volume: number | null
    is_ad_hoc_exercise: boolean | null
  }

  export type Exercise_analytics_viewCountAggregateOutputType = {
    log_id: number
    workout_session_id: number
    user_id: number
    session_date: number
    start_time: number
    end_time: number
    workout_id: number
    workout_name: number
    programme_id: number
    programme_name: number
    exercise_id: number
    exercise_name: number
    muscle_group: number
    exercise_with_metadata_id: number
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: number
    prescribed_order: number
    weight: number
    reps: number
    set_order_index: number
    volume: number
    is_ad_hoc_exercise: number
    _all: number
  }


  export type Exercise_analytics_viewAvgAggregateInputType = {
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    prescribed_order?: true
    weight?: true
    reps?: true
    set_order_index?: true
    volume?: true
  }

  export type Exercise_analytics_viewSumAggregateInputType = {
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    prescribed_order?: true
    weight?: true
    reps?: true
    set_order_index?: true
    volume?: true
  }

  export type Exercise_analytics_viewMinAggregateInputType = {
    log_id?: true
    workout_session_id?: true
    user_id?: true
    session_date?: true
    start_time?: true
    end_time?: true
    workout_id?: true
    workout_name?: true
    programme_id?: true
    programme_name?: true
    exercise_id?: true
    exercise_name?: true
    muscle_group?: true
    exercise_with_metadata_id?: true
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    tempo?: true
    prescribed_order?: true
    weight?: true
    reps?: true
    set_order_index?: true
    volume?: true
    is_ad_hoc_exercise?: true
  }

  export type Exercise_analytics_viewMaxAggregateInputType = {
    log_id?: true
    workout_session_id?: true
    user_id?: true
    session_date?: true
    start_time?: true
    end_time?: true
    workout_id?: true
    workout_name?: true
    programme_id?: true
    programme_name?: true
    exercise_id?: true
    exercise_name?: true
    muscle_group?: true
    exercise_with_metadata_id?: true
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    tempo?: true
    prescribed_order?: true
    weight?: true
    reps?: true
    set_order_index?: true
    volume?: true
    is_ad_hoc_exercise?: true
  }

  export type Exercise_analytics_viewCountAggregateInputType = {
    log_id?: true
    workout_session_id?: true
    user_id?: true
    session_date?: true
    start_time?: true
    end_time?: true
    workout_id?: true
    workout_name?: true
    programme_id?: true
    programme_name?: true
    exercise_id?: true
    exercise_name?: true
    muscle_group?: true
    exercise_with_metadata_id?: true
    reps_min?: true
    reps_max?: true
    sets_min?: true
    sets_max?: true
    rest_min?: true
    rest_max?: true
    tempo?: true
    prescribed_order?: true
    weight?: true
    reps?: true
    set_order_index?: true
    volume?: true
    is_ad_hoc_exercise?: true
    _all?: true
  }

  export type Exercise_analytics_viewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which exercise_analytics_view to aggregate.
     */
    where?: exercise_analytics_viewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of exercise_analytics_views to fetch.
     */
    orderBy?: exercise_analytics_viewOrderByWithRelationInput | exercise_analytics_viewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: exercise_analytics_viewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` exercise_analytics_views from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` exercise_analytics_views.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned exercise_analytics_views
    **/
    _count?: true | Exercise_analytics_viewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Exercise_analytics_viewAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Exercise_analytics_viewSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Exercise_analytics_viewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Exercise_analytics_viewMaxAggregateInputType
  }

  export type GetExercise_analytics_viewAggregateType<T extends Exercise_analytics_viewAggregateArgs> = {
        [P in keyof T & keyof AggregateExercise_analytics_view]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExercise_analytics_view[P]>
      : GetScalarType<T[P], AggregateExercise_analytics_view[P]>
  }




  export type exercise_analytics_viewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: exercise_analytics_viewWhereInput
    orderBy?: exercise_analytics_viewOrderByWithAggregationInput | exercise_analytics_viewOrderByWithAggregationInput[]
    by: Exercise_analytics_viewScalarFieldEnum[] | Exercise_analytics_viewScalarFieldEnum
    having?: exercise_analytics_viewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Exercise_analytics_viewCountAggregateInputType | true
    _avg?: Exercise_analytics_viewAvgAggregateInputType
    _sum?: Exercise_analytics_viewSumAggregateInputType
    _min?: Exercise_analytics_viewMinAggregateInputType
    _max?: Exercise_analytics_viewMaxAggregateInputType
  }

  export type Exercise_analytics_viewGroupByOutputType = {
    log_id: string
    workout_session_id: string
    user_id: string
    session_date: Date
    start_time: Date | null
    end_time: Date | null
    workout_id: string
    workout_name: string
    programme_id: string
    programme_name: string
    exercise_id: string
    exercise_name: string
    muscle_group: $Enums.MuscleGroup
    exercise_with_metadata_id: string | null
    reps_min: number | null
    reps_max: number | null
    sets_min: number | null
    sets_max: number | null
    rest_min: number | null
    rest_max: number | null
    tempo: string | null
    prescribed_order: number | null
    weight: number
    reps: number
    set_order_index: number
    volume: number
    is_ad_hoc_exercise: boolean
    _count: Exercise_analytics_viewCountAggregateOutputType | null
    _avg: Exercise_analytics_viewAvgAggregateOutputType | null
    _sum: Exercise_analytics_viewSumAggregateOutputType | null
    _min: Exercise_analytics_viewMinAggregateOutputType | null
    _max: Exercise_analytics_viewMaxAggregateOutputType | null
  }

  type GetExercise_analytics_viewGroupByPayload<T extends exercise_analytics_viewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Exercise_analytics_viewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Exercise_analytics_viewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Exercise_analytics_viewGroupByOutputType[P]>
            : GetScalarType<T[P], Exercise_analytics_viewGroupByOutputType[P]>
        }
      >
    >


  export type exercise_analytics_viewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    log_id?: boolean
    workout_session_id?: boolean
    user_id?: boolean
    session_date?: boolean
    start_time?: boolean
    end_time?: boolean
    workout_id?: boolean
    workout_name?: boolean
    programme_id?: boolean
    programme_name?: boolean
    exercise_id?: boolean
    exercise_name?: boolean
    muscle_group?: boolean
    exercise_with_metadata_id?: boolean
    reps_min?: boolean
    reps_max?: boolean
    sets_min?: boolean
    sets_max?: boolean
    rest_min?: boolean
    rest_max?: boolean
    tempo?: boolean
    prescribed_order?: boolean
    weight?: boolean
    reps?: boolean
    set_order_index?: boolean
    volume?: boolean
    is_ad_hoc_exercise?: boolean
  }, ExtArgs["result"]["exercise_analytics_view"]>



  export type exercise_analytics_viewSelectScalar = {
    log_id?: boolean
    workout_session_id?: boolean
    user_id?: boolean
    session_date?: boolean
    start_time?: boolean
    end_time?: boolean
    workout_id?: boolean
    workout_name?: boolean
    programme_id?: boolean
    programme_name?: boolean
    exercise_id?: boolean
    exercise_name?: boolean
    muscle_group?: boolean
    exercise_with_metadata_id?: boolean
    reps_min?: boolean
    reps_max?: boolean
    sets_min?: boolean
    sets_max?: boolean
    rest_min?: boolean
    rest_max?: boolean
    tempo?: boolean
    prescribed_order?: boolean
    weight?: boolean
    reps?: boolean
    set_order_index?: boolean
    volume?: boolean
    is_ad_hoc_exercise?: boolean
  }

  export type exercise_analytics_viewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"log_id" | "workout_session_id" | "user_id" | "session_date" | "start_time" | "end_time" | "workout_id" | "workout_name" | "programme_id" | "programme_name" | "exercise_id" | "exercise_name" | "muscle_group" | "exercise_with_metadata_id" | "reps_min" | "reps_max" | "sets_min" | "sets_max" | "rest_min" | "rest_max" | "tempo" | "prescribed_order" | "weight" | "reps" | "set_order_index" | "volume" | "is_ad_hoc_exercise", ExtArgs["result"]["exercise_analytics_view"]>

  export type $exercise_analytics_viewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "exercise_analytics_view"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      log_id: string
      workout_session_id: string
      user_id: string
      session_date: Date
      start_time: Date | null
      end_time: Date | null
      workout_id: string
      workout_name: string
      programme_id: string
      programme_name: string
      exercise_id: string
      exercise_name: string
      muscle_group: $Enums.MuscleGroup
      exercise_with_metadata_id: string | null
      reps_min: number | null
      reps_max: number | null
      sets_min: number | null
      sets_max: number | null
      rest_min: number | null
      rest_max: number | null
      tempo: string | null
      prescribed_order: number | null
      weight: number
      reps: number
      set_order_index: number
      volume: number
      is_ad_hoc_exercise: boolean
    }, ExtArgs["result"]["exercise_analytics_view"]>
    composites: {}
  }

  type exercise_analytics_viewGetPayload<S extends boolean | null | undefined | exercise_analytics_viewDefaultArgs> = $Result.GetResult<Prisma.$exercise_analytics_viewPayload, S>

  type exercise_analytics_viewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<exercise_analytics_viewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: Exercise_analytics_viewCountAggregateInputType | true
    }

  export interface exercise_analytics_viewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['exercise_analytics_view'], meta: { name: 'exercise_analytics_view' } }
    /**
     * Find zero or one Exercise_analytics_view that matches the filter.
     * @param {exercise_analytics_viewFindUniqueArgs} args - Arguments to find a Exercise_analytics_view
     * @example
     * // Get one Exercise_analytics_view
     * const exercise_analytics_view = await prisma.exercise_analytics_view.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends exercise_analytics_viewFindUniqueArgs>(args: SelectSubset<T, exercise_analytics_viewFindUniqueArgs<ExtArgs>>): Prisma__exercise_analytics_viewClient<$Result.GetResult<Prisma.$exercise_analytics_viewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Exercise_analytics_view that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {exercise_analytics_viewFindUniqueOrThrowArgs} args - Arguments to find a Exercise_analytics_view
     * @example
     * // Get one Exercise_analytics_view
     * const exercise_analytics_view = await prisma.exercise_analytics_view.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends exercise_analytics_viewFindUniqueOrThrowArgs>(args: SelectSubset<T, exercise_analytics_viewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__exercise_analytics_viewClient<$Result.GetResult<Prisma.$exercise_analytics_viewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exercise_analytics_view that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exercise_analytics_viewFindFirstArgs} args - Arguments to find a Exercise_analytics_view
     * @example
     * // Get one Exercise_analytics_view
     * const exercise_analytics_view = await prisma.exercise_analytics_view.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends exercise_analytics_viewFindFirstArgs>(args?: SelectSubset<T, exercise_analytics_viewFindFirstArgs<ExtArgs>>): Prisma__exercise_analytics_viewClient<$Result.GetResult<Prisma.$exercise_analytics_viewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Exercise_analytics_view that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exercise_analytics_viewFindFirstOrThrowArgs} args - Arguments to find a Exercise_analytics_view
     * @example
     * // Get one Exercise_analytics_view
     * const exercise_analytics_view = await prisma.exercise_analytics_view.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends exercise_analytics_viewFindFirstOrThrowArgs>(args?: SelectSubset<T, exercise_analytics_viewFindFirstOrThrowArgs<ExtArgs>>): Prisma__exercise_analytics_viewClient<$Result.GetResult<Prisma.$exercise_analytics_viewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Exercise_analytics_views that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exercise_analytics_viewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Exercise_analytics_views
     * const exercise_analytics_views = await prisma.exercise_analytics_view.findMany()
     * 
     * // Get first 10 Exercise_analytics_views
     * const exercise_analytics_views = await prisma.exercise_analytics_view.findMany({ take: 10 })
     * 
     * // Only select the `log_id`
     * const exercise_analytics_viewWithLog_idOnly = await prisma.exercise_analytics_view.findMany({ select: { log_id: true } })
     * 
     */
    findMany<T extends exercise_analytics_viewFindManyArgs>(args?: SelectSubset<T, exercise_analytics_viewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$exercise_analytics_viewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>


    /**
     * Count the number of Exercise_analytics_views.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exercise_analytics_viewCountArgs} args - Arguments to filter Exercise_analytics_views to count.
     * @example
     * // Count the number of Exercise_analytics_views
     * const count = await prisma.exercise_analytics_view.count({
     *   where: {
     *     // ... the filter for the Exercise_analytics_views we want to count
     *   }
     * })
    **/
    count<T extends exercise_analytics_viewCountArgs>(
      args?: Subset<T, exercise_analytics_viewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Exercise_analytics_viewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Exercise_analytics_view.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Exercise_analytics_viewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Exercise_analytics_viewAggregateArgs>(args: Subset<T, Exercise_analytics_viewAggregateArgs>): Prisma.PrismaPromise<GetExercise_analytics_viewAggregateType<T>>

    /**
     * Group by Exercise_analytics_view.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {exercise_analytics_viewGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends exercise_analytics_viewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: exercise_analytics_viewGroupByArgs['orderBy'] }
        : { orderBy?: exercise_analytics_viewGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, exercise_analytics_viewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExercise_analytics_viewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the exercise_analytics_view model
   */
  readonly fields: exercise_analytics_viewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for exercise_analytics_view.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__exercise_analytics_viewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the exercise_analytics_view model
   */
  interface exercise_analytics_viewFieldRefs {
    readonly log_id: FieldRef<"exercise_analytics_view", 'String'>
    readonly workout_session_id: FieldRef<"exercise_analytics_view", 'String'>
    readonly user_id: FieldRef<"exercise_analytics_view", 'String'>
    readonly session_date: FieldRef<"exercise_analytics_view", 'DateTime'>
    readonly start_time: FieldRef<"exercise_analytics_view", 'DateTime'>
    readonly end_time: FieldRef<"exercise_analytics_view", 'DateTime'>
    readonly workout_id: FieldRef<"exercise_analytics_view", 'String'>
    readonly workout_name: FieldRef<"exercise_analytics_view", 'String'>
    readonly programme_id: FieldRef<"exercise_analytics_view", 'String'>
    readonly programme_name: FieldRef<"exercise_analytics_view", 'String'>
    readonly exercise_id: FieldRef<"exercise_analytics_view", 'String'>
    readonly exercise_name: FieldRef<"exercise_analytics_view", 'String'>
    readonly muscle_group: FieldRef<"exercise_analytics_view", 'MuscleGroup'>
    readonly exercise_with_metadata_id: FieldRef<"exercise_analytics_view", 'String'>
    readonly reps_min: FieldRef<"exercise_analytics_view", 'Int'>
    readonly reps_max: FieldRef<"exercise_analytics_view", 'Int'>
    readonly sets_min: FieldRef<"exercise_analytics_view", 'Int'>
    readonly sets_max: FieldRef<"exercise_analytics_view", 'Int'>
    readonly rest_min: FieldRef<"exercise_analytics_view", 'Int'>
    readonly rest_max: FieldRef<"exercise_analytics_view", 'Int'>
    readonly tempo: FieldRef<"exercise_analytics_view", 'String'>
    readonly prescribed_order: FieldRef<"exercise_analytics_view", 'Int'>
    readonly weight: FieldRef<"exercise_analytics_view", 'Float'>
    readonly reps: FieldRef<"exercise_analytics_view", 'Int'>
    readonly set_order_index: FieldRef<"exercise_analytics_view", 'Int'>
    readonly volume: FieldRef<"exercise_analytics_view", 'Float'>
    readonly is_ad_hoc_exercise: FieldRef<"exercise_analytics_view", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * exercise_analytics_view findUnique
   */
  export type exercise_analytics_viewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exercise_analytics_view
     */
    select?: exercise_analytics_viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exercise_analytics_view
     */
    omit?: exercise_analytics_viewOmit<ExtArgs> | null
    /**
     * Filter, which exercise_analytics_view to fetch.
     */
    where: exercise_analytics_viewWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * exercise_analytics_view findUniqueOrThrow
   */
  export type exercise_analytics_viewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exercise_analytics_view
     */
    select?: exercise_analytics_viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exercise_analytics_view
     */
    omit?: exercise_analytics_viewOmit<ExtArgs> | null
    /**
     * Filter, which exercise_analytics_view to fetch.
     */
    where: exercise_analytics_viewWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * exercise_analytics_view findFirst
   */
  export type exercise_analytics_viewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exercise_analytics_view
     */
    select?: exercise_analytics_viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exercise_analytics_view
     */
    omit?: exercise_analytics_viewOmit<ExtArgs> | null
    /**
     * Filter, which exercise_analytics_view to fetch.
     */
    where?: exercise_analytics_viewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of exercise_analytics_views to fetch.
     */
    orderBy?: exercise_analytics_viewOrderByWithRelationInput | exercise_analytics_viewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for exercise_analytics_views.
     */
    cursor?: exercise_analytics_viewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` exercise_analytics_views from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` exercise_analytics_views.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of exercise_analytics_views.
     */
    distinct?: Exercise_analytics_viewScalarFieldEnum | Exercise_analytics_viewScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * exercise_analytics_view findFirstOrThrow
   */
  export type exercise_analytics_viewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exercise_analytics_view
     */
    select?: exercise_analytics_viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exercise_analytics_view
     */
    omit?: exercise_analytics_viewOmit<ExtArgs> | null
    /**
     * Filter, which exercise_analytics_view to fetch.
     */
    where?: exercise_analytics_viewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of exercise_analytics_views to fetch.
     */
    orderBy?: exercise_analytics_viewOrderByWithRelationInput | exercise_analytics_viewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for exercise_analytics_views.
     */
    cursor?: exercise_analytics_viewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` exercise_analytics_views from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` exercise_analytics_views.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of exercise_analytics_views.
     */
    distinct?: Exercise_analytics_viewScalarFieldEnum | Exercise_analytics_viewScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * exercise_analytics_view findMany
   */
  export type exercise_analytics_viewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exercise_analytics_view
     */
    select?: exercise_analytics_viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exercise_analytics_view
     */
    omit?: exercise_analytics_viewOmit<ExtArgs> | null
    /**
     * Filter, which exercise_analytics_views to fetch.
     */
    where?: exercise_analytics_viewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of exercise_analytics_views to fetch.
     */
    orderBy?: exercise_analytics_viewOrderByWithRelationInput | exercise_analytics_viewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing exercise_analytics_views.
     */
    cursor?: exercise_analytics_viewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` exercise_analytics_views from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` exercise_analytics_views.
     */
    skip?: number
    distinct?: Exercise_analytics_viewScalarFieldEnum | Exercise_analytics_viewScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * exercise_analytics_view without action
   */
  export type exercise_analytics_viewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the exercise_analytics_view
     */
    select?: exercise_analytics_viewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the exercise_analytics_view
     */
    omit?: exercise_analytics_viewOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password_hash: 'password_hash',
    created_at: 'created_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RelationLoadStrategy: {
    query: 'query',
    join: 'join'
  };

  export type RelationLoadStrategy = (typeof RelationLoadStrategy)[keyof typeof RelationLoadStrategy]


  export const FeedbackScalarFieldEnum: {
    id: 'id',
    description: 'description',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_id: 'user_id'
  };

  export type FeedbackScalarFieldEnum = (typeof FeedbackScalarFieldEnum)[keyof typeof FeedbackScalarFieldEnum]


  export const ExerciseScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    muscle_group: 'muscle_group',
    is_global: 'is_global',
    user_id: 'user_id'
  };

  export type ExerciseScalarFieldEnum = (typeof ExerciseScalarFieldEnum)[keyof typeof ExerciseScalarFieldEnum]


  export const ProgrammeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    user_id: 'user_id',
    is_active: 'is_active'
  };

  export type ProgrammeScalarFieldEnum = (typeof ProgrammeScalarFieldEnum)[keyof typeof ProgrammeScalarFieldEnum]


  export const ProgrammeActivityLogScalarFieldEnum: {
    id: 'id',
    start_time: 'start_time',
    end_time: 'end_time',
    programme_id: 'programme_id',
    user_id: 'user_id'
  };

  export type ProgrammeActivityLogScalarFieldEnum = (typeof ProgrammeActivityLogScalarFieldEnum)[keyof typeof ProgrammeActivityLogScalarFieldEnum]


  export const WorkoutScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    order_index: 'order_index',
    programme_id: 'programme_id'
  };

  export type WorkoutScalarFieldEnum = (typeof WorkoutScalarFieldEnum)[keyof typeof WorkoutScalarFieldEnum]


  export const WorkoutSessionScalarFieldEnum: {
    id: 'id',
    start_time: 'start_time',
    end_time: 'end_time',
    notes: 'notes',
    date: 'date',
    workout_id: 'workout_id',
    user_id: 'user_id'
  };

  export type WorkoutSessionScalarFieldEnum = (typeof WorkoutSessionScalarFieldEnum)[keyof typeof WorkoutSessionScalarFieldEnum]


  export const ExerciseWithMetadataScalarFieldEnum: {
    id: 'id',
    reps_min: 'reps_min',
    reps_max: 'reps_max',
    sets_min: 'sets_min',
    sets_max: 'sets_max',
    rest_min: 'rest_min',
    rest_max: 'rest_max',
    tempo: 'tempo',
    order_index: 'order_index',
    is_hidden: 'is_hidden',
    exercise_id: 'exercise_id',
    workout_id: 'workout_id'
  };

  export type ExerciseWithMetadataScalarFieldEnum = (typeof ExerciseWithMetadataScalarFieldEnum)[keyof typeof ExerciseWithMetadataScalarFieldEnum]


  export const ExerciseLogScalarFieldEnum: {
    id: 'id',
    weight: 'weight',
    reps: 'reps',
    set_order_index: 'set_order_index',
    rpe: 'rpe',
    date: 'date',
    pr_type: 'pr_type',
    user_id: 'user_id',
    exerciseId: 'exerciseId'
  };

  export type ExerciseLogScalarFieldEnum = (typeof ExerciseLogScalarFieldEnum)[keyof typeof ExerciseLogScalarFieldEnum]


  export const SessionExerciseLogScalarFieldEnum: {
    id: 'id',
    notes: 'notes',
    workout_session_id: 'workout_session_id',
    exercise_with_metadata_id: 'exercise_with_metadata_id',
    user_id: 'user_id',
    exercise_log_id: 'exercise_log_id'
  };

  export type SessionExerciseLogScalarFieldEnum = (typeof SessionExerciseLogScalarFieldEnum)[keyof typeof SessionExerciseLogScalarFieldEnum]


  export const Exercise_analytics_viewScalarFieldEnum: {
    log_id: 'log_id',
    workout_session_id: 'workout_session_id',
    user_id: 'user_id',
    session_date: 'session_date',
    start_time: 'start_time',
    end_time: 'end_time',
    workout_id: 'workout_id',
    workout_name: 'workout_name',
    programme_id: 'programme_id',
    programme_name: 'programme_name',
    exercise_id: 'exercise_id',
    exercise_name: 'exercise_name',
    muscle_group: 'muscle_group',
    exercise_with_metadata_id: 'exercise_with_metadata_id',
    reps_min: 'reps_min',
    reps_max: 'reps_max',
    sets_min: 'sets_min',
    sets_max: 'sets_max',
    rest_min: 'rest_min',
    rest_max: 'rest_max',
    tempo: 'tempo',
    prescribed_order: 'prescribed_order',
    weight: 'weight',
    reps: 'reps',
    set_order_index: 'set_order_index',
    volume: 'volume',
    is_ad_hoc_exercise: 'is_ad_hoc_exercise'
  };

  export type Exercise_analytics_viewScalarFieldEnum = (typeof Exercise_analytics_viewScalarFieldEnum)[keyof typeof Exercise_analytics_viewScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'FeedbackStatus'
   */
  export type EnumFeedbackStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeedbackStatus'>
    


  /**
   * Reference to a field of type 'FeedbackStatus[]'
   */
  export type ListEnumFeedbackStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FeedbackStatus[]'>
    


  /**
   * Reference to a field of type 'MuscleGroup'
   */
  export type EnumMuscleGroupFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MuscleGroup'>
    


  /**
   * Reference to a field of type 'MuscleGroup[]'
   */
  export type ListEnumMuscleGroupFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MuscleGroup[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password_hash?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    programmes?: ProgrammeListRelationFilter
    exercises?: ExerciseListRelationFilter
    workoutSessions?: WorkoutSessionListRelationFilter
    sessionExerciseLogs?: SessionExerciseLogListRelationFilter
    exerciseLogs?: ExerciseLogListRelationFilter
    feedbackEntries?: FeedbackListRelationFilter
    activityLogs?: ProgrammeActivityLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    programmes?: ProgrammeOrderByRelationAggregateInput
    exercises?: ExerciseOrderByRelationAggregateInput
    workoutSessions?: WorkoutSessionOrderByRelationAggregateInput
    sessionExerciseLogs?: SessionExerciseLogOrderByRelationAggregateInput
    exerciseLogs?: ExerciseLogOrderByRelationAggregateInput
    feedbackEntries?: FeedbackOrderByRelationAggregateInput
    activityLogs?: ProgrammeActivityLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password_hash?: StringFilter<"User"> | string
    created_at?: DateTimeFilter<"User"> | Date | string
    programmes?: ProgrammeListRelationFilter
    exercises?: ExerciseListRelationFilter
    workoutSessions?: WorkoutSessionListRelationFilter
    sessionExerciseLogs?: SessionExerciseLogListRelationFilter
    exerciseLogs?: ExerciseLogListRelationFilter
    feedbackEntries?: FeedbackListRelationFilter
    activityLogs?: ProgrammeActivityLogListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password_hash?: StringWithAggregatesFilter<"User"> | string
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type FeedbackWhereInput = {
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    id?: StringFilter<"Feedback"> | string
    description?: StringFilter<"Feedback"> | string
    status?: EnumFeedbackStatusFilter<"Feedback"> | $Enums.FeedbackStatus
    created_at?: DateTimeFilter<"Feedback"> | Date | string
    updated_at?: DateTimeFilter<"Feedback"> | Date | string
    user_id?: StringFilter<"Feedback"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FeedbackOrderByWithRelationInput = {
    id?: SortOrder
    description?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type FeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    description?: StringFilter<"Feedback"> | string
    status?: EnumFeedbackStatusFilter<"Feedback"> | $Enums.FeedbackStatus
    created_at?: DateTimeFilter<"Feedback"> | Date | string
    updated_at?: DateTimeFilter<"Feedback"> | Date | string
    user_id?: StringFilter<"Feedback"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type FeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    description?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    _count?: FeedbackCountOrderByAggregateInput
    _max?: FeedbackMaxOrderByAggregateInput
    _min?: FeedbackMinOrderByAggregateInput
  }

  export type FeedbackScalarWhereWithAggregatesInput = {
    AND?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    OR?: FeedbackScalarWhereWithAggregatesInput[]
    NOT?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Feedback"> | string
    description?: StringWithAggregatesFilter<"Feedback"> | string
    status?: EnumFeedbackStatusWithAggregatesFilter<"Feedback"> | $Enums.FeedbackStatus
    created_at?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
    user_id?: StringWithAggregatesFilter<"Feedback"> | string
  }

  export type ExerciseWhereInput = {
    AND?: ExerciseWhereInput | ExerciseWhereInput[]
    OR?: ExerciseWhereInput[]
    NOT?: ExerciseWhereInput | ExerciseWhereInput[]
    id?: StringFilter<"Exercise"> | string
    name?: StringFilter<"Exercise"> | string
    description?: StringNullableFilter<"Exercise"> | string | null
    muscle_group?: EnumMuscleGroupFilter<"Exercise"> | $Enums.MuscleGroup
    is_global?: BoolFilter<"Exercise"> | boolean
    user_id?: StringNullableFilter<"Exercise"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    exercisesWithMetadata?: ExerciseWithMetadataListRelationFilter
    exerciseLogs?: ExerciseLogListRelationFilter
  }

  export type ExerciseOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    muscle_group?: SortOrder
    is_global?: SortOrder
    user_id?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    exercisesWithMetadata?: ExerciseWithMetadataOrderByRelationAggregateInput
    exerciseLogs?: ExerciseLogOrderByRelationAggregateInput
  }

  export type ExerciseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExerciseWhereInput | ExerciseWhereInput[]
    OR?: ExerciseWhereInput[]
    NOT?: ExerciseWhereInput | ExerciseWhereInput[]
    name?: StringFilter<"Exercise"> | string
    description?: StringNullableFilter<"Exercise"> | string | null
    muscle_group?: EnumMuscleGroupFilter<"Exercise"> | $Enums.MuscleGroup
    is_global?: BoolFilter<"Exercise"> | boolean
    user_id?: StringNullableFilter<"Exercise"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    exercisesWithMetadata?: ExerciseWithMetadataListRelationFilter
    exerciseLogs?: ExerciseLogListRelationFilter
  }, "id">

  export type ExerciseOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    muscle_group?: SortOrder
    is_global?: SortOrder
    user_id?: SortOrderInput | SortOrder
    _count?: ExerciseCountOrderByAggregateInput
    _max?: ExerciseMaxOrderByAggregateInput
    _min?: ExerciseMinOrderByAggregateInput
  }

  export type ExerciseScalarWhereWithAggregatesInput = {
    AND?: ExerciseScalarWhereWithAggregatesInput | ExerciseScalarWhereWithAggregatesInput[]
    OR?: ExerciseScalarWhereWithAggregatesInput[]
    NOT?: ExerciseScalarWhereWithAggregatesInput | ExerciseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Exercise"> | string
    name?: StringWithAggregatesFilter<"Exercise"> | string
    description?: StringNullableWithAggregatesFilter<"Exercise"> | string | null
    muscle_group?: EnumMuscleGroupWithAggregatesFilter<"Exercise"> | $Enums.MuscleGroup
    is_global?: BoolWithAggregatesFilter<"Exercise"> | boolean
    user_id?: StringNullableWithAggregatesFilter<"Exercise"> | string | null
  }

  export type ProgrammeWhereInput = {
    AND?: ProgrammeWhereInput | ProgrammeWhereInput[]
    OR?: ProgrammeWhereInput[]
    NOT?: ProgrammeWhereInput | ProgrammeWhereInput[]
    id?: StringFilter<"Programme"> | string
    name?: StringFilter<"Programme"> | string
    description?: StringNullableFilter<"Programme"> | string | null
    user_id?: StringFilter<"Programme"> | string
    is_active?: BoolFilter<"Programme"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    workouts?: WorkoutListRelationFilter
    activity_logs?: ProgrammeActivityLogListRelationFilter
  }

  export type ProgrammeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    user_id?: SortOrder
    is_active?: SortOrder
    user?: UserOrderByWithRelationInput
    workouts?: WorkoutOrderByRelationAggregateInput
    activity_logs?: ProgrammeActivityLogOrderByRelationAggregateInput
  }

  export type ProgrammeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProgrammeWhereInput | ProgrammeWhereInput[]
    OR?: ProgrammeWhereInput[]
    NOT?: ProgrammeWhereInput | ProgrammeWhereInput[]
    name?: StringFilter<"Programme"> | string
    description?: StringNullableFilter<"Programme"> | string | null
    user_id?: StringFilter<"Programme"> | string
    is_active?: BoolFilter<"Programme"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    workouts?: WorkoutListRelationFilter
    activity_logs?: ProgrammeActivityLogListRelationFilter
  }, "id">

  export type ProgrammeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    user_id?: SortOrder
    is_active?: SortOrder
    _count?: ProgrammeCountOrderByAggregateInput
    _max?: ProgrammeMaxOrderByAggregateInput
    _min?: ProgrammeMinOrderByAggregateInput
  }

  export type ProgrammeScalarWhereWithAggregatesInput = {
    AND?: ProgrammeScalarWhereWithAggregatesInput | ProgrammeScalarWhereWithAggregatesInput[]
    OR?: ProgrammeScalarWhereWithAggregatesInput[]
    NOT?: ProgrammeScalarWhereWithAggregatesInput | ProgrammeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Programme"> | string
    name?: StringWithAggregatesFilter<"Programme"> | string
    description?: StringNullableWithAggregatesFilter<"Programme"> | string | null
    user_id?: StringWithAggregatesFilter<"Programme"> | string
    is_active?: BoolWithAggregatesFilter<"Programme"> | boolean
  }

  export type ProgrammeActivityLogWhereInput = {
    AND?: ProgrammeActivityLogWhereInput | ProgrammeActivityLogWhereInput[]
    OR?: ProgrammeActivityLogWhereInput[]
    NOT?: ProgrammeActivityLogWhereInput | ProgrammeActivityLogWhereInput[]
    id?: StringFilter<"ProgrammeActivityLog"> | string
    start_time?: DateTimeFilter<"ProgrammeActivityLog"> | Date | string
    end_time?: DateTimeNullableFilter<"ProgrammeActivityLog"> | Date | string | null
    programme_id?: StringFilter<"ProgrammeActivityLog"> | string
    user_id?: StringFilter<"ProgrammeActivityLog"> | string
    programme?: XOR<ProgrammeScalarRelationFilter, ProgrammeWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ProgrammeActivityLogOrderByWithRelationInput = {
    id?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrderInput | SortOrder
    programme_id?: SortOrder
    user_id?: SortOrder
    programme?: ProgrammeOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ProgrammeActivityLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProgrammeActivityLogWhereInput | ProgrammeActivityLogWhereInput[]
    OR?: ProgrammeActivityLogWhereInput[]
    NOT?: ProgrammeActivityLogWhereInput | ProgrammeActivityLogWhereInput[]
    start_time?: DateTimeFilter<"ProgrammeActivityLog"> | Date | string
    end_time?: DateTimeNullableFilter<"ProgrammeActivityLog"> | Date | string | null
    programme_id?: StringFilter<"ProgrammeActivityLog"> | string
    user_id?: StringFilter<"ProgrammeActivityLog"> | string
    programme?: XOR<ProgrammeScalarRelationFilter, ProgrammeWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ProgrammeActivityLogOrderByWithAggregationInput = {
    id?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrderInput | SortOrder
    programme_id?: SortOrder
    user_id?: SortOrder
    _count?: ProgrammeActivityLogCountOrderByAggregateInput
    _max?: ProgrammeActivityLogMaxOrderByAggregateInput
    _min?: ProgrammeActivityLogMinOrderByAggregateInput
  }

  export type ProgrammeActivityLogScalarWhereWithAggregatesInput = {
    AND?: ProgrammeActivityLogScalarWhereWithAggregatesInput | ProgrammeActivityLogScalarWhereWithAggregatesInput[]
    OR?: ProgrammeActivityLogScalarWhereWithAggregatesInput[]
    NOT?: ProgrammeActivityLogScalarWhereWithAggregatesInput | ProgrammeActivityLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProgrammeActivityLog"> | string
    start_time?: DateTimeWithAggregatesFilter<"ProgrammeActivityLog"> | Date | string
    end_time?: DateTimeNullableWithAggregatesFilter<"ProgrammeActivityLog"> | Date | string | null
    programme_id?: StringWithAggregatesFilter<"ProgrammeActivityLog"> | string
    user_id?: StringWithAggregatesFilter<"ProgrammeActivityLog"> | string
  }

  export type WorkoutWhereInput = {
    AND?: WorkoutWhereInput | WorkoutWhereInput[]
    OR?: WorkoutWhereInput[]
    NOT?: WorkoutWhereInput | WorkoutWhereInput[]
    id?: StringFilter<"Workout"> | string
    name?: StringFilter<"Workout"> | string
    description?: StringNullableFilter<"Workout"> | string | null
    order_index?: IntFilter<"Workout"> | number
    programme_id?: StringFilter<"Workout"> | string
    programme?: XOR<ProgrammeScalarRelationFilter, ProgrammeWhereInput>
    exercisesWithMetadata?: ExerciseWithMetadataListRelationFilter
    workoutSessions?: WorkoutSessionListRelationFilter
  }

  export type WorkoutOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    order_index?: SortOrder
    programme_id?: SortOrder
    programme?: ProgrammeOrderByWithRelationInput
    exercisesWithMetadata?: ExerciseWithMetadataOrderByRelationAggregateInput
    workoutSessions?: WorkoutSessionOrderByRelationAggregateInput
  }

  export type WorkoutWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkoutWhereInput | WorkoutWhereInput[]
    OR?: WorkoutWhereInput[]
    NOT?: WorkoutWhereInput | WorkoutWhereInput[]
    name?: StringFilter<"Workout"> | string
    description?: StringNullableFilter<"Workout"> | string | null
    order_index?: IntFilter<"Workout"> | number
    programme_id?: StringFilter<"Workout"> | string
    programme?: XOR<ProgrammeScalarRelationFilter, ProgrammeWhereInput>
    exercisesWithMetadata?: ExerciseWithMetadataListRelationFilter
    workoutSessions?: WorkoutSessionListRelationFilter
  }, "id">

  export type WorkoutOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    order_index?: SortOrder
    programme_id?: SortOrder
    _count?: WorkoutCountOrderByAggregateInput
    _avg?: WorkoutAvgOrderByAggregateInput
    _max?: WorkoutMaxOrderByAggregateInput
    _min?: WorkoutMinOrderByAggregateInput
    _sum?: WorkoutSumOrderByAggregateInput
  }

  export type WorkoutScalarWhereWithAggregatesInput = {
    AND?: WorkoutScalarWhereWithAggregatesInput | WorkoutScalarWhereWithAggregatesInput[]
    OR?: WorkoutScalarWhereWithAggregatesInput[]
    NOT?: WorkoutScalarWhereWithAggregatesInput | WorkoutScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Workout"> | string
    name?: StringWithAggregatesFilter<"Workout"> | string
    description?: StringNullableWithAggregatesFilter<"Workout"> | string | null
    order_index?: IntWithAggregatesFilter<"Workout"> | number
    programme_id?: StringWithAggregatesFilter<"Workout"> | string
  }

  export type WorkoutSessionWhereInput = {
    AND?: WorkoutSessionWhereInput | WorkoutSessionWhereInput[]
    OR?: WorkoutSessionWhereInput[]
    NOT?: WorkoutSessionWhereInput | WorkoutSessionWhereInput[]
    id?: StringFilter<"WorkoutSession"> | string
    start_time?: DateTimeNullableFilter<"WorkoutSession"> | Date | string | null
    end_time?: DateTimeNullableFilter<"WorkoutSession"> | Date | string | null
    notes?: StringNullableFilter<"WorkoutSession"> | string | null
    date?: DateTimeFilter<"WorkoutSession"> | Date | string
    workout_id?: StringNullableFilter<"WorkoutSession"> | string | null
    user_id?: StringFilter<"WorkoutSession"> | string
    workout?: XOR<WorkoutNullableScalarRelationFilter, WorkoutWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    sessionExerciseLogs?: SessionExerciseLogListRelationFilter
  }

  export type WorkoutSessionOrderByWithRelationInput = {
    id?: SortOrder
    start_time?: SortOrderInput | SortOrder
    end_time?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    date?: SortOrder
    workout_id?: SortOrderInput | SortOrder
    user_id?: SortOrder
    workout?: WorkoutOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    sessionExerciseLogs?: SessionExerciseLogOrderByRelationAggregateInput
  }

  export type WorkoutSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkoutSessionWhereInput | WorkoutSessionWhereInput[]
    OR?: WorkoutSessionWhereInput[]
    NOT?: WorkoutSessionWhereInput | WorkoutSessionWhereInput[]
    start_time?: DateTimeNullableFilter<"WorkoutSession"> | Date | string | null
    end_time?: DateTimeNullableFilter<"WorkoutSession"> | Date | string | null
    notes?: StringNullableFilter<"WorkoutSession"> | string | null
    date?: DateTimeFilter<"WorkoutSession"> | Date | string
    workout_id?: StringNullableFilter<"WorkoutSession"> | string | null
    user_id?: StringFilter<"WorkoutSession"> | string
    workout?: XOR<WorkoutNullableScalarRelationFilter, WorkoutWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    sessionExerciseLogs?: SessionExerciseLogListRelationFilter
  }, "id">

  export type WorkoutSessionOrderByWithAggregationInput = {
    id?: SortOrder
    start_time?: SortOrderInput | SortOrder
    end_time?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    date?: SortOrder
    workout_id?: SortOrderInput | SortOrder
    user_id?: SortOrder
    _count?: WorkoutSessionCountOrderByAggregateInput
    _max?: WorkoutSessionMaxOrderByAggregateInput
    _min?: WorkoutSessionMinOrderByAggregateInput
  }

  export type WorkoutSessionScalarWhereWithAggregatesInput = {
    AND?: WorkoutSessionScalarWhereWithAggregatesInput | WorkoutSessionScalarWhereWithAggregatesInput[]
    OR?: WorkoutSessionScalarWhereWithAggregatesInput[]
    NOT?: WorkoutSessionScalarWhereWithAggregatesInput | WorkoutSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkoutSession"> | string
    start_time?: DateTimeNullableWithAggregatesFilter<"WorkoutSession"> | Date | string | null
    end_time?: DateTimeNullableWithAggregatesFilter<"WorkoutSession"> | Date | string | null
    notes?: StringNullableWithAggregatesFilter<"WorkoutSession"> | string | null
    date?: DateTimeWithAggregatesFilter<"WorkoutSession"> | Date | string
    workout_id?: StringNullableWithAggregatesFilter<"WorkoutSession"> | string | null
    user_id?: StringWithAggregatesFilter<"WorkoutSession"> | string
  }

  export type ExerciseWithMetadataWhereInput = {
    AND?: ExerciseWithMetadataWhereInput | ExerciseWithMetadataWhereInput[]
    OR?: ExerciseWithMetadataWhereInput[]
    NOT?: ExerciseWithMetadataWhereInput | ExerciseWithMetadataWhereInput[]
    id?: StringFilter<"ExerciseWithMetadata"> | string
    reps_min?: IntFilter<"ExerciseWithMetadata"> | number
    reps_max?: IntFilter<"ExerciseWithMetadata"> | number
    sets_min?: IntFilter<"ExerciseWithMetadata"> | number
    sets_max?: IntFilter<"ExerciseWithMetadata"> | number
    rest_min?: IntFilter<"ExerciseWithMetadata"> | number
    rest_max?: IntFilter<"ExerciseWithMetadata"> | number
    tempo?: StringFilter<"ExerciseWithMetadata"> | string
    order_index?: IntFilter<"ExerciseWithMetadata"> | number
    is_hidden?: BoolFilter<"ExerciseWithMetadata"> | boolean
    exercise_id?: StringFilter<"ExerciseWithMetadata"> | string
    workout_id?: StringFilter<"ExerciseWithMetadata"> | string
    exercise?: XOR<ExerciseScalarRelationFilter, ExerciseWhereInput>
    workout?: XOR<WorkoutScalarRelationFilter, WorkoutWhereInput>
    sessionExerciseLogs?: SessionExerciseLogListRelationFilter
  }

  export type ExerciseWithMetadataOrderByWithRelationInput = {
    id?: SortOrder
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    tempo?: SortOrder
    order_index?: SortOrder
    is_hidden?: SortOrder
    exercise_id?: SortOrder
    workout_id?: SortOrder
    exercise?: ExerciseOrderByWithRelationInput
    workout?: WorkoutOrderByWithRelationInput
    sessionExerciseLogs?: SessionExerciseLogOrderByRelationAggregateInput
  }

  export type ExerciseWithMetadataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExerciseWithMetadataWhereInput | ExerciseWithMetadataWhereInput[]
    OR?: ExerciseWithMetadataWhereInput[]
    NOT?: ExerciseWithMetadataWhereInput | ExerciseWithMetadataWhereInput[]
    reps_min?: IntFilter<"ExerciseWithMetadata"> | number
    reps_max?: IntFilter<"ExerciseWithMetadata"> | number
    sets_min?: IntFilter<"ExerciseWithMetadata"> | number
    sets_max?: IntFilter<"ExerciseWithMetadata"> | number
    rest_min?: IntFilter<"ExerciseWithMetadata"> | number
    rest_max?: IntFilter<"ExerciseWithMetadata"> | number
    tempo?: StringFilter<"ExerciseWithMetadata"> | string
    order_index?: IntFilter<"ExerciseWithMetadata"> | number
    is_hidden?: BoolFilter<"ExerciseWithMetadata"> | boolean
    exercise_id?: StringFilter<"ExerciseWithMetadata"> | string
    workout_id?: StringFilter<"ExerciseWithMetadata"> | string
    exercise?: XOR<ExerciseScalarRelationFilter, ExerciseWhereInput>
    workout?: XOR<WorkoutScalarRelationFilter, WorkoutWhereInput>
    sessionExerciseLogs?: SessionExerciseLogListRelationFilter
  }, "id">

  export type ExerciseWithMetadataOrderByWithAggregationInput = {
    id?: SortOrder
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    tempo?: SortOrder
    order_index?: SortOrder
    is_hidden?: SortOrder
    exercise_id?: SortOrder
    workout_id?: SortOrder
    _count?: ExerciseWithMetadataCountOrderByAggregateInput
    _avg?: ExerciseWithMetadataAvgOrderByAggregateInput
    _max?: ExerciseWithMetadataMaxOrderByAggregateInput
    _min?: ExerciseWithMetadataMinOrderByAggregateInput
    _sum?: ExerciseWithMetadataSumOrderByAggregateInput
  }

  export type ExerciseWithMetadataScalarWhereWithAggregatesInput = {
    AND?: ExerciseWithMetadataScalarWhereWithAggregatesInput | ExerciseWithMetadataScalarWhereWithAggregatesInput[]
    OR?: ExerciseWithMetadataScalarWhereWithAggregatesInput[]
    NOT?: ExerciseWithMetadataScalarWhereWithAggregatesInput | ExerciseWithMetadataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExerciseWithMetadata"> | string
    reps_min?: IntWithAggregatesFilter<"ExerciseWithMetadata"> | number
    reps_max?: IntWithAggregatesFilter<"ExerciseWithMetadata"> | number
    sets_min?: IntWithAggregatesFilter<"ExerciseWithMetadata"> | number
    sets_max?: IntWithAggregatesFilter<"ExerciseWithMetadata"> | number
    rest_min?: IntWithAggregatesFilter<"ExerciseWithMetadata"> | number
    rest_max?: IntWithAggregatesFilter<"ExerciseWithMetadata"> | number
    tempo?: StringWithAggregatesFilter<"ExerciseWithMetadata"> | string
    order_index?: IntWithAggregatesFilter<"ExerciseWithMetadata"> | number
    is_hidden?: BoolWithAggregatesFilter<"ExerciseWithMetadata"> | boolean
    exercise_id?: StringWithAggregatesFilter<"ExerciseWithMetadata"> | string
    workout_id?: StringWithAggregatesFilter<"ExerciseWithMetadata"> | string
  }

  export type ExerciseLogWhereInput = {
    AND?: ExerciseLogWhereInput | ExerciseLogWhereInput[]
    OR?: ExerciseLogWhereInput[]
    NOT?: ExerciseLogWhereInput | ExerciseLogWhereInput[]
    id?: StringFilter<"ExerciseLog"> | string
    weight?: FloatNullableFilter<"ExerciseLog"> | number | null
    reps?: IntFilter<"ExerciseLog"> | number
    set_order_index?: IntFilter<"ExerciseLog"> | number
    rpe?: FloatNullableFilter<"ExerciseLog"> | number | null
    date?: DateTimeFilter<"ExerciseLog"> | Date | string
    pr_type?: StringNullableFilter<"ExerciseLog"> | string | null
    user_id?: StringFilter<"ExerciseLog"> | string
    exerciseId?: StringNullableFilter<"ExerciseLog"> | string | null
    sessionExerciseLog?: XOR<SessionExerciseLogNullableScalarRelationFilter, SessionExerciseLogWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    exercise?: XOR<ExerciseNullableScalarRelationFilter, ExerciseWhereInput> | null
  }

  export type ExerciseLogOrderByWithRelationInput = {
    id?: SortOrder
    weight?: SortOrderInput | SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    rpe?: SortOrderInput | SortOrder
    date?: SortOrder
    pr_type?: SortOrderInput | SortOrder
    user_id?: SortOrder
    exerciseId?: SortOrderInput | SortOrder
    sessionExerciseLog?: SessionExerciseLogOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    exercise?: ExerciseOrderByWithRelationInput
  }

  export type ExerciseLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExerciseLogWhereInput | ExerciseLogWhereInput[]
    OR?: ExerciseLogWhereInput[]
    NOT?: ExerciseLogWhereInput | ExerciseLogWhereInput[]
    weight?: FloatNullableFilter<"ExerciseLog"> | number | null
    reps?: IntFilter<"ExerciseLog"> | number
    set_order_index?: IntFilter<"ExerciseLog"> | number
    rpe?: FloatNullableFilter<"ExerciseLog"> | number | null
    date?: DateTimeFilter<"ExerciseLog"> | Date | string
    pr_type?: StringNullableFilter<"ExerciseLog"> | string | null
    user_id?: StringFilter<"ExerciseLog"> | string
    exerciseId?: StringNullableFilter<"ExerciseLog"> | string | null
    sessionExerciseLog?: XOR<SessionExerciseLogNullableScalarRelationFilter, SessionExerciseLogWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    exercise?: XOR<ExerciseNullableScalarRelationFilter, ExerciseWhereInput> | null
  }, "id">

  export type ExerciseLogOrderByWithAggregationInput = {
    id?: SortOrder
    weight?: SortOrderInput | SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    rpe?: SortOrderInput | SortOrder
    date?: SortOrder
    pr_type?: SortOrderInput | SortOrder
    user_id?: SortOrder
    exerciseId?: SortOrderInput | SortOrder
    _count?: ExerciseLogCountOrderByAggregateInput
    _avg?: ExerciseLogAvgOrderByAggregateInput
    _max?: ExerciseLogMaxOrderByAggregateInput
    _min?: ExerciseLogMinOrderByAggregateInput
    _sum?: ExerciseLogSumOrderByAggregateInput
  }

  export type ExerciseLogScalarWhereWithAggregatesInput = {
    AND?: ExerciseLogScalarWhereWithAggregatesInput | ExerciseLogScalarWhereWithAggregatesInput[]
    OR?: ExerciseLogScalarWhereWithAggregatesInput[]
    NOT?: ExerciseLogScalarWhereWithAggregatesInput | ExerciseLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExerciseLog"> | string
    weight?: FloatNullableWithAggregatesFilter<"ExerciseLog"> | number | null
    reps?: IntWithAggregatesFilter<"ExerciseLog"> | number
    set_order_index?: IntWithAggregatesFilter<"ExerciseLog"> | number
    rpe?: FloatNullableWithAggregatesFilter<"ExerciseLog"> | number | null
    date?: DateTimeWithAggregatesFilter<"ExerciseLog"> | Date | string
    pr_type?: StringNullableWithAggregatesFilter<"ExerciseLog"> | string | null
    user_id?: StringWithAggregatesFilter<"ExerciseLog"> | string
    exerciseId?: StringNullableWithAggregatesFilter<"ExerciseLog"> | string | null
  }

  export type SessionExerciseLogWhereInput = {
    AND?: SessionExerciseLogWhereInput | SessionExerciseLogWhereInput[]
    OR?: SessionExerciseLogWhereInput[]
    NOT?: SessionExerciseLogWhereInput | SessionExerciseLogWhereInput[]
    id?: StringFilter<"SessionExerciseLog"> | string
    notes?: StringNullableFilter<"SessionExerciseLog"> | string | null
    workout_session_id?: StringFilter<"SessionExerciseLog"> | string
    exercise_with_metadata_id?: StringNullableFilter<"SessionExerciseLog"> | string | null
    user_id?: StringFilter<"SessionExerciseLog"> | string
    exercise_log_id?: StringNullableFilter<"SessionExerciseLog"> | string | null
    workoutSession?: XOR<WorkoutSessionScalarRelationFilter, WorkoutSessionWhereInput>
    exerciseWithMetadata?: XOR<ExerciseWithMetadataNullableScalarRelationFilter, ExerciseWithMetadataWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    exerciseLog?: XOR<ExerciseLogNullableScalarRelationFilter, ExerciseLogWhereInput> | null
  }

  export type SessionExerciseLogOrderByWithRelationInput = {
    id?: SortOrder
    notes?: SortOrderInput | SortOrder
    workout_session_id?: SortOrder
    exercise_with_metadata_id?: SortOrderInput | SortOrder
    user_id?: SortOrder
    exercise_log_id?: SortOrderInput | SortOrder
    workoutSession?: WorkoutSessionOrderByWithRelationInput
    exerciseWithMetadata?: ExerciseWithMetadataOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    exerciseLog?: ExerciseLogOrderByWithRelationInput
  }

  export type SessionExerciseLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    exercise_log_id?: string
    AND?: SessionExerciseLogWhereInput | SessionExerciseLogWhereInput[]
    OR?: SessionExerciseLogWhereInput[]
    NOT?: SessionExerciseLogWhereInput | SessionExerciseLogWhereInput[]
    notes?: StringNullableFilter<"SessionExerciseLog"> | string | null
    workout_session_id?: StringFilter<"SessionExerciseLog"> | string
    exercise_with_metadata_id?: StringNullableFilter<"SessionExerciseLog"> | string | null
    user_id?: StringFilter<"SessionExerciseLog"> | string
    workoutSession?: XOR<WorkoutSessionScalarRelationFilter, WorkoutSessionWhereInput>
    exerciseWithMetadata?: XOR<ExerciseWithMetadataNullableScalarRelationFilter, ExerciseWithMetadataWhereInput> | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    exerciseLog?: XOR<ExerciseLogNullableScalarRelationFilter, ExerciseLogWhereInput> | null
  }, "id" | "exercise_log_id">

  export type SessionExerciseLogOrderByWithAggregationInput = {
    id?: SortOrder
    notes?: SortOrderInput | SortOrder
    workout_session_id?: SortOrder
    exercise_with_metadata_id?: SortOrderInput | SortOrder
    user_id?: SortOrder
    exercise_log_id?: SortOrderInput | SortOrder
    _count?: SessionExerciseLogCountOrderByAggregateInput
    _max?: SessionExerciseLogMaxOrderByAggregateInput
    _min?: SessionExerciseLogMinOrderByAggregateInput
  }

  export type SessionExerciseLogScalarWhereWithAggregatesInput = {
    AND?: SessionExerciseLogScalarWhereWithAggregatesInput | SessionExerciseLogScalarWhereWithAggregatesInput[]
    OR?: SessionExerciseLogScalarWhereWithAggregatesInput[]
    NOT?: SessionExerciseLogScalarWhereWithAggregatesInput | SessionExerciseLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SessionExerciseLog"> | string
    notes?: StringNullableWithAggregatesFilter<"SessionExerciseLog"> | string | null
    workout_session_id?: StringWithAggregatesFilter<"SessionExerciseLog"> | string
    exercise_with_metadata_id?: StringNullableWithAggregatesFilter<"SessionExerciseLog"> | string | null
    user_id?: StringWithAggregatesFilter<"SessionExerciseLog"> | string
    exercise_log_id?: StringNullableWithAggregatesFilter<"SessionExerciseLog"> | string | null
  }

  export type exercise_analytics_viewWhereInput = {
    AND?: exercise_analytics_viewWhereInput | exercise_analytics_viewWhereInput[]
    OR?: exercise_analytics_viewWhereInput[]
    NOT?: exercise_analytics_viewWhereInput | exercise_analytics_viewWhereInput[]
    log_id?: StringFilter<"exercise_analytics_view"> | string
    workout_session_id?: StringFilter<"exercise_analytics_view"> | string
    user_id?: StringFilter<"exercise_analytics_view"> | string
    session_date?: DateTimeFilter<"exercise_analytics_view"> | Date | string
    start_time?: DateTimeNullableFilter<"exercise_analytics_view"> | Date | string | null
    end_time?: DateTimeNullableFilter<"exercise_analytics_view"> | Date | string | null
    workout_id?: StringFilter<"exercise_analytics_view"> | string
    workout_name?: StringFilter<"exercise_analytics_view"> | string
    programme_id?: StringFilter<"exercise_analytics_view"> | string
    programme_name?: StringFilter<"exercise_analytics_view"> | string
    exercise_id?: StringFilter<"exercise_analytics_view"> | string
    exercise_name?: StringFilter<"exercise_analytics_view"> | string
    muscle_group?: EnumMuscleGroupFilter<"exercise_analytics_view"> | $Enums.MuscleGroup
    exercise_with_metadata_id?: StringNullableFilter<"exercise_analytics_view"> | string | null
    reps_min?: IntNullableFilter<"exercise_analytics_view"> | number | null
    reps_max?: IntNullableFilter<"exercise_analytics_view"> | number | null
    sets_min?: IntNullableFilter<"exercise_analytics_view"> | number | null
    sets_max?: IntNullableFilter<"exercise_analytics_view"> | number | null
    rest_min?: IntNullableFilter<"exercise_analytics_view"> | number | null
    rest_max?: IntNullableFilter<"exercise_analytics_view"> | number | null
    tempo?: StringNullableFilter<"exercise_analytics_view"> | string | null
    prescribed_order?: IntNullableFilter<"exercise_analytics_view"> | number | null
    weight?: FloatFilter<"exercise_analytics_view"> | number
    reps?: IntFilter<"exercise_analytics_view"> | number
    set_order_index?: IntFilter<"exercise_analytics_view"> | number
    volume?: FloatFilter<"exercise_analytics_view"> | number
    is_ad_hoc_exercise?: BoolFilter<"exercise_analytics_view"> | boolean
  }

  export type exercise_analytics_viewOrderByWithRelationInput = {
    log_id?: SortOrder
    workout_session_id?: SortOrder
    user_id?: SortOrder
    session_date?: SortOrder
    start_time?: SortOrderInput | SortOrder
    end_time?: SortOrderInput | SortOrder
    workout_id?: SortOrder
    workout_name?: SortOrder
    programme_id?: SortOrder
    programme_name?: SortOrder
    exercise_id?: SortOrder
    exercise_name?: SortOrder
    muscle_group?: SortOrder
    exercise_with_metadata_id?: SortOrderInput | SortOrder
    reps_min?: SortOrderInput | SortOrder
    reps_max?: SortOrderInput | SortOrder
    sets_min?: SortOrderInput | SortOrder
    sets_max?: SortOrderInput | SortOrder
    rest_min?: SortOrderInput | SortOrder
    rest_max?: SortOrderInput | SortOrder
    tempo?: SortOrderInput | SortOrder
    prescribed_order?: SortOrderInput | SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    volume?: SortOrder
    is_ad_hoc_exercise?: SortOrder
  }

  export type exercise_analytics_viewWhereUniqueInput = Prisma.AtLeast<{
    log_id?: string
    AND?: exercise_analytics_viewWhereInput | exercise_analytics_viewWhereInput[]
    OR?: exercise_analytics_viewWhereInput[]
    NOT?: exercise_analytics_viewWhereInput | exercise_analytics_viewWhereInput[]
    workout_session_id?: StringFilter<"exercise_analytics_view"> | string
    user_id?: StringFilter<"exercise_analytics_view"> | string
    session_date?: DateTimeFilter<"exercise_analytics_view"> | Date | string
    start_time?: DateTimeNullableFilter<"exercise_analytics_view"> | Date | string | null
    end_time?: DateTimeNullableFilter<"exercise_analytics_view"> | Date | string | null
    workout_id?: StringFilter<"exercise_analytics_view"> | string
    workout_name?: StringFilter<"exercise_analytics_view"> | string
    programme_id?: StringFilter<"exercise_analytics_view"> | string
    programme_name?: StringFilter<"exercise_analytics_view"> | string
    exercise_id?: StringFilter<"exercise_analytics_view"> | string
    exercise_name?: StringFilter<"exercise_analytics_view"> | string
    muscle_group?: EnumMuscleGroupFilter<"exercise_analytics_view"> | $Enums.MuscleGroup
    exercise_with_metadata_id?: StringNullableFilter<"exercise_analytics_view"> | string | null
    reps_min?: IntNullableFilter<"exercise_analytics_view"> | number | null
    reps_max?: IntNullableFilter<"exercise_analytics_view"> | number | null
    sets_min?: IntNullableFilter<"exercise_analytics_view"> | number | null
    sets_max?: IntNullableFilter<"exercise_analytics_view"> | number | null
    rest_min?: IntNullableFilter<"exercise_analytics_view"> | number | null
    rest_max?: IntNullableFilter<"exercise_analytics_view"> | number | null
    tempo?: StringNullableFilter<"exercise_analytics_view"> | string | null
    prescribed_order?: IntNullableFilter<"exercise_analytics_view"> | number | null
    weight?: FloatFilter<"exercise_analytics_view"> | number
    reps?: IntFilter<"exercise_analytics_view"> | number
    set_order_index?: IntFilter<"exercise_analytics_view"> | number
    volume?: FloatFilter<"exercise_analytics_view"> | number
    is_ad_hoc_exercise?: BoolFilter<"exercise_analytics_view"> | boolean
  }, "log_id">

  export type exercise_analytics_viewOrderByWithAggregationInput = {
    log_id?: SortOrder
    workout_session_id?: SortOrder
    user_id?: SortOrder
    session_date?: SortOrder
    start_time?: SortOrderInput | SortOrder
    end_time?: SortOrderInput | SortOrder
    workout_id?: SortOrder
    workout_name?: SortOrder
    programme_id?: SortOrder
    programme_name?: SortOrder
    exercise_id?: SortOrder
    exercise_name?: SortOrder
    muscle_group?: SortOrder
    exercise_with_metadata_id?: SortOrderInput | SortOrder
    reps_min?: SortOrderInput | SortOrder
    reps_max?: SortOrderInput | SortOrder
    sets_min?: SortOrderInput | SortOrder
    sets_max?: SortOrderInput | SortOrder
    rest_min?: SortOrderInput | SortOrder
    rest_max?: SortOrderInput | SortOrder
    tempo?: SortOrderInput | SortOrder
    prescribed_order?: SortOrderInput | SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    volume?: SortOrder
    is_ad_hoc_exercise?: SortOrder
    _count?: exercise_analytics_viewCountOrderByAggregateInput
    _avg?: exercise_analytics_viewAvgOrderByAggregateInput
    _max?: exercise_analytics_viewMaxOrderByAggregateInput
    _min?: exercise_analytics_viewMinOrderByAggregateInput
    _sum?: exercise_analytics_viewSumOrderByAggregateInput
  }

  export type exercise_analytics_viewScalarWhereWithAggregatesInput = {
    AND?: exercise_analytics_viewScalarWhereWithAggregatesInput | exercise_analytics_viewScalarWhereWithAggregatesInput[]
    OR?: exercise_analytics_viewScalarWhereWithAggregatesInput[]
    NOT?: exercise_analytics_viewScalarWhereWithAggregatesInput | exercise_analytics_viewScalarWhereWithAggregatesInput[]
    log_id?: StringWithAggregatesFilter<"exercise_analytics_view"> | string
    workout_session_id?: StringWithAggregatesFilter<"exercise_analytics_view"> | string
    user_id?: StringWithAggregatesFilter<"exercise_analytics_view"> | string
    session_date?: DateTimeWithAggregatesFilter<"exercise_analytics_view"> | Date | string
    start_time?: DateTimeNullableWithAggregatesFilter<"exercise_analytics_view"> | Date | string | null
    end_time?: DateTimeNullableWithAggregatesFilter<"exercise_analytics_view"> | Date | string | null
    workout_id?: StringWithAggregatesFilter<"exercise_analytics_view"> | string
    workout_name?: StringWithAggregatesFilter<"exercise_analytics_view"> | string
    programme_id?: StringWithAggregatesFilter<"exercise_analytics_view"> | string
    programme_name?: StringWithAggregatesFilter<"exercise_analytics_view"> | string
    exercise_id?: StringWithAggregatesFilter<"exercise_analytics_view"> | string
    exercise_name?: StringWithAggregatesFilter<"exercise_analytics_view"> | string
    muscle_group?: EnumMuscleGroupWithAggregatesFilter<"exercise_analytics_view"> | $Enums.MuscleGroup
    exercise_with_metadata_id?: StringNullableWithAggregatesFilter<"exercise_analytics_view"> | string | null
    reps_min?: IntNullableWithAggregatesFilter<"exercise_analytics_view"> | number | null
    reps_max?: IntNullableWithAggregatesFilter<"exercise_analytics_view"> | number | null
    sets_min?: IntNullableWithAggregatesFilter<"exercise_analytics_view"> | number | null
    sets_max?: IntNullableWithAggregatesFilter<"exercise_analytics_view"> | number | null
    rest_min?: IntNullableWithAggregatesFilter<"exercise_analytics_view"> | number | null
    rest_max?: IntNullableWithAggregatesFilter<"exercise_analytics_view"> | number | null
    tempo?: StringNullableWithAggregatesFilter<"exercise_analytics_view"> | string | null
    prescribed_order?: IntNullableWithAggregatesFilter<"exercise_analytics_view"> | number | null
    weight?: FloatWithAggregatesFilter<"exercise_analytics_view"> | number
    reps?: IntWithAggregatesFilter<"exercise_analytics_view"> | number
    set_order_index?: IntWithAggregatesFilter<"exercise_analytics_view"> | number
    volume?: FloatWithAggregatesFilter<"exercise_analytics_view"> | number
    is_ad_hoc_exercise?: BoolWithAggregatesFilter<"exercise_analytics_view"> | boolean
  }

  export type UserCreateInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeCreateNestedManyWithoutUserInput
    exercises?: ExerciseCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeUncheckedCreateNestedManyWithoutUserInput
    exercises?: ExerciseUncheckedCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUncheckedUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUncheckedUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackCreateInput = {
    id?: string
    description: string
    status?: $Enums.FeedbackStatus
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutFeedbackEntriesInput
  }

  export type FeedbackUncheckedCreateInput = {
    id?: string
    description: string
    status?: $Enums.FeedbackStatus
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
  }

  export type FeedbackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumFeedbackStatusFieldUpdateOperationsInput | $Enums.FeedbackStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFeedbackEntriesNestedInput
  }

  export type FeedbackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumFeedbackStatusFieldUpdateOperationsInput | $Enums.FeedbackStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type FeedbackCreateManyInput = {
    id?: string
    description: string
    status?: $Enums.FeedbackStatus
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
  }

  export type FeedbackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumFeedbackStatusFieldUpdateOperationsInput | $Enums.FeedbackStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumFeedbackStatusFieldUpdateOperationsInput | $Enums.FeedbackStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type ExerciseCreateInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
    user?: UserCreateNestedOneWithoutExercisesInput
    exercisesWithMetadata?: ExerciseWithMetadataCreateNestedManyWithoutExerciseInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
    user_id?: string | null
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedCreateNestedManyWithoutExerciseInput
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneWithoutExercisesNestedInput
    exercisesWithMetadata?: ExerciseWithMetadataUpdateManyWithoutExerciseNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedUpdateManyWithoutExerciseNestedInput
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
    user_id?: string | null
  }

  export type ExerciseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExerciseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProgrammeCreateInput = {
    id?: string
    name: string
    description?: string | null
    is_active?: boolean
    user: UserCreateNestedOneWithoutProgrammesInput
    workouts?: WorkoutCreateNestedManyWithoutProgrammeInput
    activity_logs?: ProgrammeActivityLogCreateNestedManyWithoutProgrammeInput
  }

  export type ProgrammeUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    user_id: string
    is_active?: boolean
    workouts?: WorkoutUncheckedCreateNestedManyWithoutProgrammeInput
    activity_logs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutProgrammeInput
  }

  export type ProgrammeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutProgrammesNestedInput
    workouts?: WorkoutUpdateManyWithoutProgrammeNestedInput
    activity_logs?: ProgrammeActivityLogUpdateManyWithoutProgrammeNestedInput
  }

  export type ProgrammeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    workouts?: WorkoutUncheckedUpdateManyWithoutProgrammeNestedInput
    activity_logs?: ProgrammeActivityLogUncheckedUpdateManyWithoutProgrammeNestedInput
  }

  export type ProgrammeCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    user_id: string
    is_active?: boolean
  }

  export type ProgrammeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProgrammeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProgrammeActivityLogCreateInput = {
    id?: string
    start_time?: Date | string
    end_time?: Date | string | null
    programme: ProgrammeCreateNestedOneWithoutActivity_logsInput
    user: UserCreateNestedOneWithoutActivityLogsInput
  }

  export type ProgrammeActivityLogUncheckedCreateInput = {
    id?: string
    start_time?: Date | string
    end_time?: Date | string | null
    programme_id: string
    user_id: string
  }

  export type ProgrammeActivityLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    programme?: ProgrammeUpdateOneRequiredWithoutActivity_logsNestedInput
    user?: UserUpdateOneRequiredWithoutActivityLogsNestedInput
  }

  export type ProgrammeActivityLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    programme_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type ProgrammeActivityLogCreateManyInput = {
    id?: string
    start_time?: Date | string
    end_time?: Date | string | null
    programme_id: string
    user_id: string
  }

  export type ProgrammeActivityLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProgrammeActivityLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    programme_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type WorkoutCreateInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
    programme: ProgrammeCreateNestedOneWithoutWorkoutsInput
    exercisesWithMetadata?: ExerciseWithMetadataCreateNestedManyWithoutWorkoutInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutWorkoutInput
  }

  export type WorkoutUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
    programme_id: string
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedCreateNestedManyWithoutWorkoutInput
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutWorkoutInput
  }

  export type WorkoutUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
    programme?: ProgrammeUpdateOneRequiredWithoutWorkoutsNestedInput
    exercisesWithMetadata?: ExerciseWithMetadataUpdateManyWithoutWorkoutNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutWorkoutNestedInput
  }

  export type WorkoutUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
    programme_id?: StringFieldUpdateOperationsInput | string
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedUpdateManyWithoutWorkoutNestedInput
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutWorkoutNestedInput
  }

  export type WorkoutCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
    programme_id: string
  }

  export type WorkoutUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
  }

  export type WorkoutUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
    programme_id?: StringFieldUpdateOperationsInput | string
  }

  export type WorkoutSessionCreateInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    workout?: WorkoutCreateNestedOneWithoutWorkoutSessionsInput
    user: UserCreateNestedOneWithoutWorkoutSessionsInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutWorkoutSessionInput
  }

  export type WorkoutSessionUncheckedCreateInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    workout_id?: string | null
    user_id: string
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutWorkoutSessionInput
  }

  export type WorkoutSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    workout?: WorkoutUpdateOneWithoutWorkoutSessionsNestedInput
    user?: UserUpdateOneRequiredWithoutWorkoutSessionsNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutWorkoutSessionNestedInput
  }

  export type WorkoutSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    workout_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutWorkoutSessionNestedInput
  }

  export type WorkoutSessionCreateManyInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    workout_id?: string | null
    user_id: string
  }

  export type WorkoutSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkoutSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    workout_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type ExerciseWithMetadataCreateInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    exercise: ExerciseCreateNestedOneWithoutExercisesWithMetadataInput
    workout: WorkoutCreateNestedOneWithoutExercisesWithMetadataInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutExerciseWithMetadataInput
  }

  export type ExerciseWithMetadataUncheckedCreateInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    exercise_id: string
    workout_id: string
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutExerciseWithMetadataInput
  }

  export type ExerciseWithMetadataUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    exercise?: ExerciseUpdateOneRequiredWithoutExercisesWithMetadataNestedInput
    workout?: WorkoutUpdateOneRequiredWithoutExercisesWithMetadataNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutExerciseWithMetadataNestedInput
  }

  export type ExerciseWithMetadataUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    exercise_id?: StringFieldUpdateOperationsInput | string
    workout_id?: StringFieldUpdateOperationsInput | string
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutExerciseWithMetadataNestedInput
  }

  export type ExerciseWithMetadataCreateManyInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    exercise_id: string
    workout_id: string
  }

  export type ExerciseWithMetadataUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExerciseWithMetadataUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    exercise_id?: StringFieldUpdateOperationsInput | string
    workout_id?: StringFieldUpdateOperationsInput | string
  }

  export type ExerciseLogCreateInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    sessionExerciseLog?: SessionExerciseLogCreateNestedOneWithoutExerciseLogInput
    user: UserCreateNestedOneWithoutExerciseLogsInput
    exercise?: ExerciseCreateNestedOneWithoutExerciseLogsInput
  }

  export type ExerciseLogUncheckedCreateInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    user_id: string
    exerciseId?: string | null
    sessionExerciseLog?: SessionExerciseLogUncheckedCreateNestedOneWithoutExerciseLogInput
  }

  export type ExerciseLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExerciseLog?: SessionExerciseLogUpdateOneWithoutExerciseLogNestedInput
    user?: UserUpdateOneRequiredWithoutExerciseLogsNestedInput
    exercise?: ExerciseUpdateOneWithoutExerciseLogsNestedInput
  }

  export type ExerciseLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    exerciseId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExerciseLog?: SessionExerciseLogUncheckedUpdateOneWithoutExerciseLogNestedInput
  }

  export type ExerciseLogCreateManyInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    user_id: string
    exerciseId?: string | null
  }

  export type ExerciseLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ExerciseLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    exerciseId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionExerciseLogCreateInput = {
    id?: string
    notes?: string | null
    workoutSession: WorkoutSessionCreateNestedOneWithoutSessionExerciseLogsInput
    exerciseWithMetadata?: ExerciseWithMetadataCreateNestedOneWithoutSessionExerciseLogsInput
    user: UserCreateNestedOneWithoutSessionExerciseLogsInput
    exerciseLog?: ExerciseLogCreateNestedOneWithoutSessionExerciseLogInput
  }

  export type SessionExerciseLogUncheckedCreateInput = {
    id?: string
    notes?: string | null
    workout_session_id: string
    exercise_with_metadata_id?: string | null
    user_id: string
    exercise_log_id?: string | null
  }

  export type SessionExerciseLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workoutSession?: WorkoutSessionUpdateOneRequiredWithoutSessionExerciseLogsNestedInput
    exerciseWithMetadata?: ExerciseWithMetadataUpdateOneWithoutSessionExerciseLogsNestedInput
    user?: UserUpdateOneRequiredWithoutSessionExerciseLogsNestedInput
    exerciseLog?: ExerciseLogUpdateOneWithoutSessionExerciseLogNestedInput
  }

  export type SessionExerciseLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workout_session_id?: StringFieldUpdateOperationsInput | string
    exercise_with_metadata_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    exercise_log_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionExerciseLogCreateManyInput = {
    id?: string
    notes?: string | null
    workout_session_id: string
    exercise_with_metadata_id?: string | null
    user_id: string
    exercise_log_id?: string | null
  }

  export type SessionExerciseLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionExerciseLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workout_session_id?: StringFieldUpdateOperationsInput | string
    exercise_with_metadata_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    exercise_log_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProgrammeListRelationFilter = {
    every?: ProgrammeWhereInput
    some?: ProgrammeWhereInput
    none?: ProgrammeWhereInput
  }

  export type ExerciseListRelationFilter = {
    every?: ExerciseWhereInput
    some?: ExerciseWhereInput
    none?: ExerciseWhereInput
  }

  export type WorkoutSessionListRelationFilter = {
    every?: WorkoutSessionWhereInput
    some?: WorkoutSessionWhereInput
    none?: WorkoutSessionWhereInput
  }

  export type SessionExerciseLogListRelationFilter = {
    every?: SessionExerciseLogWhereInput
    some?: SessionExerciseLogWhereInput
    none?: SessionExerciseLogWhereInput
  }

  export type ExerciseLogListRelationFilter = {
    every?: ExerciseLogWhereInput
    some?: ExerciseLogWhereInput
    none?: ExerciseLogWhereInput
  }

  export type FeedbackListRelationFilter = {
    every?: FeedbackWhereInput
    some?: FeedbackWhereInput
    none?: FeedbackWhereInput
  }

  export type ProgrammeActivityLogListRelationFilter = {
    every?: ProgrammeActivityLogWhereInput
    some?: ProgrammeActivityLogWhereInput
    none?: ProgrammeActivityLogWhereInput
  }

  export type ProgrammeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExerciseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkoutSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionExerciseLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExerciseLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FeedbackOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProgrammeActivityLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    created_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumFeedbackStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackStatus | EnumFeedbackStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackStatus[] | ListEnumFeedbackStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackStatus[] | ListEnumFeedbackStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackStatusFilter<$PrismaModel> | $Enums.FeedbackStatus
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type FeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type FeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    description?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type EnumFeedbackStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackStatus | EnumFeedbackStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackStatus[] | ListEnumFeedbackStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackStatus[] | ListEnumFeedbackStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackStatusWithAggregatesFilter<$PrismaModel> | $Enums.FeedbackStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFeedbackStatusFilter<$PrismaModel>
    _max?: NestedEnumFeedbackStatusFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumMuscleGroupFilter<$PrismaModel = never> = {
    equals?: $Enums.MuscleGroup | EnumMuscleGroupFieldRefInput<$PrismaModel>
    in?: $Enums.MuscleGroup[] | ListEnumMuscleGroupFieldRefInput<$PrismaModel>
    notIn?: $Enums.MuscleGroup[] | ListEnumMuscleGroupFieldRefInput<$PrismaModel>
    not?: NestedEnumMuscleGroupFilter<$PrismaModel> | $Enums.MuscleGroup
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ExerciseWithMetadataListRelationFilter = {
    every?: ExerciseWithMetadataWhereInput
    some?: ExerciseWithMetadataWhereInput
    none?: ExerciseWithMetadataWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ExerciseWithMetadataOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExerciseCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    muscle_group?: SortOrder
    is_global?: SortOrder
    user_id?: SortOrder
  }

  export type ExerciseMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    muscle_group?: SortOrder
    is_global?: SortOrder
    user_id?: SortOrder
  }

  export type ExerciseMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    muscle_group?: SortOrder
    is_global?: SortOrder
    user_id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumMuscleGroupWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MuscleGroup | EnumMuscleGroupFieldRefInput<$PrismaModel>
    in?: $Enums.MuscleGroup[] | ListEnumMuscleGroupFieldRefInput<$PrismaModel>
    notIn?: $Enums.MuscleGroup[] | ListEnumMuscleGroupFieldRefInput<$PrismaModel>
    not?: NestedEnumMuscleGroupWithAggregatesFilter<$PrismaModel> | $Enums.MuscleGroup
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMuscleGroupFilter<$PrismaModel>
    _max?: NestedEnumMuscleGroupFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type WorkoutListRelationFilter = {
    every?: WorkoutWhereInput
    some?: WorkoutWhereInput
    none?: WorkoutWhereInput
  }

  export type WorkoutOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProgrammeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    user_id?: SortOrder
    is_active?: SortOrder
  }

  export type ProgrammeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    user_id?: SortOrder
    is_active?: SortOrder
  }

  export type ProgrammeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    user_id?: SortOrder
    is_active?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ProgrammeScalarRelationFilter = {
    is?: ProgrammeWhereInput
    isNot?: ProgrammeWhereInput
  }

  export type ProgrammeActivityLogCountOrderByAggregateInput = {
    id?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    programme_id?: SortOrder
    user_id?: SortOrder
  }

  export type ProgrammeActivityLogMaxOrderByAggregateInput = {
    id?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    programme_id?: SortOrder
    user_id?: SortOrder
  }

  export type ProgrammeActivityLogMinOrderByAggregateInput = {
    id?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    programme_id?: SortOrder
    user_id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type WorkoutCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order_index?: SortOrder
    programme_id?: SortOrder
  }

  export type WorkoutAvgOrderByAggregateInput = {
    order_index?: SortOrder
  }

  export type WorkoutMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order_index?: SortOrder
    programme_id?: SortOrder
  }

  export type WorkoutMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order_index?: SortOrder
    programme_id?: SortOrder
  }

  export type WorkoutSumOrderByAggregateInput = {
    order_index?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type WorkoutNullableScalarRelationFilter = {
    is?: WorkoutWhereInput | null
    isNot?: WorkoutWhereInput | null
  }

  export type WorkoutSessionCountOrderByAggregateInput = {
    id?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    notes?: SortOrder
    date?: SortOrder
    workout_id?: SortOrder
    user_id?: SortOrder
  }

  export type WorkoutSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    notes?: SortOrder
    date?: SortOrder
    workout_id?: SortOrder
    user_id?: SortOrder
  }

  export type WorkoutSessionMinOrderByAggregateInput = {
    id?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    notes?: SortOrder
    date?: SortOrder
    workout_id?: SortOrder
    user_id?: SortOrder
  }

  export type ExerciseScalarRelationFilter = {
    is?: ExerciseWhereInput
    isNot?: ExerciseWhereInput
  }

  export type WorkoutScalarRelationFilter = {
    is?: WorkoutWhereInput
    isNot?: WorkoutWhereInput
  }

  export type ExerciseWithMetadataCountOrderByAggregateInput = {
    id?: SortOrder
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    tempo?: SortOrder
    order_index?: SortOrder
    is_hidden?: SortOrder
    exercise_id?: SortOrder
    workout_id?: SortOrder
  }

  export type ExerciseWithMetadataAvgOrderByAggregateInput = {
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    order_index?: SortOrder
  }

  export type ExerciseWithMetadataMaxOrderByAggregateInput = {
    id?: SortOrder
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    tempo?: SortOrder
    order_index?: SortOrder
    is_hidden?: SortOrder
    exercise_id?: SortOrder
    workout_id?: SortOrder
  }

  export type ExerciseWithMetadataMinOrderByAggregateInput = {
    id?: SortOrder
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    tempo?: SortOrder
    order_index?: SortOrder
    is_hidden?: SortOrder
    exercise_id?: SortOrder
    workout_id?: SortOrder
  }

  export type ExerciseWithMetadataSumOrderByAggregateInput = {
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    order_index?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type SessionExerciseLogNullableScalarRelationFilter = {
    is?: SessionExerciseLogWhereInput | null
    isNot?: SessionExerciseLogWhereInput | null
  }

  export type ExerciseNullableScalarRelationFilter = {
    is?: ExerciseWhereInput | null
    isNot?: ExerciseWhereInput | null
  }

  export type ExerciseLogCountOrderByAggregateInput = {
    id?: SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    rpe?: SortOrder
    date?: SortOrder
    pr_type?: SortOrder
    user_id?: SortOrder
    exerciseId?: SortOrder
  }

  export type ExerciseLogAvgOrderByAggregateInput = {
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    rpe?: SortOrder
  }

  export type ExerciseLogMaxOrderByAggregateInput = {
    id?: SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    rpe?: SortOrder
    date?: SortOrder
    pr_type?: SortOrder
    user_id?: SortOrder
    exerciseId?: SortOrder
  }

  export type ExerciseLogMinOrderByAggregateInput = {
    id?: SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    rpe?: SortOrder
    date?: SortOrder
    pr_type?: SortOrder
    user_id?: SortOrder
    exerciseId?: SortOrder
  }

  export type ExerciseLogSumOrderByAggregateInput = {
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    rpe?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type WorkoutSessionScalarRelationFilter = {
    is?: WorkoutSessionWhereInput
    isNot?: WorkoutSessionWhereInput
  }

  export type ExerciseWithMetadataNullableScalarRelationFilter = {
    is?: ExerciseWithMetadataWhereInput | null
    isNot?: ExerciseWithMetadataWhereInput | null
  }

  export type ExerciseLogNullableScalarRelationFilter = {
    is?: ExerciseLogWhereInput | null
    isNot?: ExerciseLogWhereInput | null
  }

  export type SessionExerciseLogCountOrderByAggregateInput = {
    id?: SortOrder
    notes?: SortOrder
    workout_session_id?: SortOrder
    exercise_with_metadata_id?: SortOrder
    user_id?: SortOrder
    exercise_log_id?: SortOrder
  }

  export type SessionExerciseLogMaxOrderByAggregateInput = {
    id?: SortOrder
    notes?: SortOrder
    workout_session_id?: SortOrder
    exercise_with_metadata_id?: SortOrder
    user_id?: SortOrder
    exercise_log_id?: SortOrder
  }

  export type SessionExerciseLogMinOrderByAggregateInput = {
    id?: SortOrder
    notes?: SortOrder
    workout_session_id?: SortOrder
    exercise_with_metadata_id?: SortOrder
    user_id?: SortOrder
    exercise_log_id?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type exercise_analytics_viewCountOrderByAggregateInput = {
    log_id?: SortOrder
    workout_session_id?: SortOrder
    user_id?: SortOrder
    session_date?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    workout_id?: SortOrder
    workout_name?: SortOrder
    programme_id?: SortOrder
    programme_name?: SortOrder
    exercise_id?: SortOrder
    exercise_name?: SortOrder
    muscle_group?: SortOrder
    exercise_with_metadata_id?: SortOrder
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    tempo?: SortOrder
    prescribed_order?: SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    volume?: SortOrder
    is_ad_hoc_exercise?: SortOrder
  }

  export type exercise_analytics_viewAvgOrderByAggregateInput = {
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    prescribed_order?: SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    volume?: SortOrder
  }

  export type exercise_analytics_viewMaxOrderByAggregateInput = {
    log_id?: SortOrder
    workout_session_id?: SortOrder
    user_id?: SortOrder
    session_date?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    workout_id?: SortOrder
    workout_name?: SortOrder
    programme_id?: SortOrder
    programme_name?: SortOrder
    exercise_id?: SortOrder
    exercise_name?: SortOrder
    muscle_group?: SortOrder
    exercise_with_metadata_id?: SortOrder
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    tempo?: SortOrder
    prescribed_order?: SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    volume?: SortOrder
    is_ad_hoc_exercise?: SortOrder
  }

  export type exercise_analytics_viewMinOrderByAggregateInput = {
    log_id?: SortOrder
    workout_session_id?: SortOrder
    user_id?: SortOrder
    session_date?: SortOrder
    start_time?: SortOrder
    end_time?: SortOrder
    workout_id?: SortOrder
    workout_name?: SortOrder
    programme_id?: SortOrder
    programme_name?: SortOrder
    exercise_id?: SortOrder
    exercise_name?: SortOrder
    muscle_group?: SortOrder
    exercise_with_metadata_id?: SortOrder
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    tempo?: SortOrder
    prescribed_order?: SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    volume?: SortOrder
    is_ad_hoc_exercise?: SortOrder
  }

  export type exercise_analytics_viewSumOrderByAggregateInput = {
    reps_min?: SortOrder
    reps_max?: SortOrder
    sets_min?: SortOrder
    sets_max?: SortOrder
    rest_min?: SortOrder
    rest_max?: SortOrder
    prescribed_order?: SortOrder
    weight?: SortOrder
    reps?: SortOrder
    set_order_index?: SortOrder
    volume?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ProgrammeCreateNestedManyWithoutUserInput = {
    create?: XOR<ProgrammeCreateWithoutUserInput, ProgrammeUncheckedCreateWithoutUserInput> | ProgrammeCreateWithoutUserInput[] | ProgrammeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgrammeCreateOrConnectWithoutUserInput | ProgrammeCreateOrConnectWithoutUserInput[]
    createMany?: ProgrammeCreateManyUserInputEnvelope
    connect?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
  }

  export type ExerciseCreateNestedManyWithoutUserInput = {
    create?: XOR<ExerciseCreateWithoutUserInput, ExerciseUncheckedCreateWithoutUserInput> | ExerciseCreateWithoutUserInput[] | ExerciseUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExerciseCreateOrConnectWithoutUserInput | ExerciseCreateOrConnectWithoutUserInput[]
    createMany?: ExerciseCreateManyUserInputEnvelope
    connect?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
  }

  export type WorkoutSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkoutSessionCreateWithoutUserInput, WorkoutSessionUncheckedCreateWithoutUserInput> | WorkoutSessionCreateWithoutUserInput[] | WorkoutSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutUserInput | WorkoutSessionCreateOrConnectWithoutUserInput[]
    createMany?: WorkoutSessionCreateManyUserInputEnvelope
    connect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
  }

  export type SessionExerciseLogCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionExerciseLogCreateWithoutUserInput, SessionExerciseLogUncheckedCreateWithoutUserInput> | SessionExerciseLogCreateWithoutUserInput[] | SessionExerciseLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutUserInput | SessionExerciseLogCreateOrConnectWithoutUserInput[]
    createMany?: SessionExerciseLogCreateManyUserInputEnvelope
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
  }

  export type ExerciseLogCreateNestedManyWithoutUserInput = {
    create?: XOR<ExerciseLogCreateWithoutUserInput, ExerciseLogUncheckedCreateWithoutUserInput> | ExerciseLogCreateWithoutUserInput[] | ExerciseLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutUserInput | ExerciseLogCreateOrConnectWithoutUserInput[]
    createMany?: ExerciseLogCreateManyUserInputEnvelope
    connect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
  }

  export type FeedbackCreateNestedManyWithoutUserInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput> | FeedbackCreateWithoutUserInput[] | FeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput | FeedbackCreateOrConnectWithoutUserInput[]
    createMany?: FeedbackCreateManyUserInputEnvelope
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
  }

  export type ProgrammeActivityLogCreateNestedManyWithoutUserInput = {
    create?: XOR<ProgrammeActivityLogCreateWithoutUserInput, ProgrammeActivityLogUncheckedCreateWithoutUserInput> | ProgrammeActivityLogCreateWithoutUserInput[] | ProgrammeActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgrammeActivityLogCreateOrConnectWithoutUserInput | ProgrammeActivityLogCreateOrConnectWithoutUserInput[]
    createMany?: ProgrammeActivityLogCreateManyUserInputEnvelope
    connect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
  }

  export type ProgrammeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProgrammeCreateWithoutUserInput, ProgrammeUncheckedCreateWithoutUserInput> | ProgrammeCreateWithoutUserInput[] | ProgrammeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgrammeCreateOrConnectWithoutUserInput | ProgrammeCreateOrConnectWithoutUserInput[]
    createMany?: ProgrammeCreateManyUserInputEnvelope
    connect?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
  }

  export type ExerciseUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ExerciseCreateWithoutUserInput, ExerciseUncheckedCreateWithoutUserInput> | ExerciseCreateWithoutUserInput[] | ExerciseUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExerciseCreateOrConnectWithoutUserInput | ExerciseCreateOrConnectWithoutUserInput[]
    createMany?: ExerciseCreateManyUserInputEnvelope
    connect?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
  }

  export type WorkoutSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkoutSessionCreateWithoutUserInput, WorkoutSessionUncheckedCreateWithoutUserInput> | WorkoutSessionCreateWithoutUserInput[] | WorkoutSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutUserInput | WorkoutSessionCreateOrConnectWithoutUserInput[]
    createMany?: WorkoutSessionCreateManyUserInputEnvelope
    connect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
  }

  export type SessionExerciseLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionExerciseLogCreateWithoutUserInput, SessionExerciseLogUncheckedCreateWithoutUserInput> | SessionExerciseLogCreateWithoutUserInput[] | SessionExerciseLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutUserInput | SessionExerciseLogCreateOrConnectWithoutUserInput[]
    createMany?: SessionExerciseLogCreateManyUserInputEnvelope
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
  }

  export type ExerciseLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ExerciseLogCreateWithoutUserInput, ExerciseLogUncheckedCreateWithoutUserInput> | ExerciseLogCreateWithoutUserInput[] | ExerciseLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutUserInput | ExerciseLogCreateOrConnectWithoutUserInput[]
    createMany?: ExerciseLogCreateManyUserInputEnvelope
    connect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
  }

  export type FeedbackUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput> | FeedbackCreateWithoutUserInput[] | FeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput | FeedbackCreateOrConnectWithoutUserInput[]
    createMany?: FeedbackCreateManyUserInputEnvelope
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
  }

  export type ProgrammeActivityLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProgrammeActivityLogCreateWithoutUserInput, ProgrammeActivityLogUncheckedCreateWithoutUserInput> | ProgrammeActivityLogCreateWithoutUserInput[] | ProgrammeActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgrammeActivityLogCreateOrConnectWithoutUserInput | ProgrammeActivityLogCreateOrConnectWithoutUserInput[]
    createMany?: ProgrammeActivityLogCreateManyUserInputEnvelope
    connect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProgrammeUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProgrammeCreateWithoutUserInput, ProgrammeUncheckedCreateWithoutUserInput> | ProgrammeCreateWithoutUserInput[] | ProgrammeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgrammeCreateOrConnectWithoutUserInput | ProgrammeCreateOrConnectWithoutUserInput[]
    upsert?: ProgrammeUpsertWithWhereUniqueWithoutUserInput | ProgrammeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProgrammeCreateManyUserInputEnvelope
    set?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
    disconnect?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
    delete?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
    connect?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
    update?: ProgrammeUpdateWithWhereUniqueWithoutUserInput | ProgrammeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProgrammeUpdateManyWithWhereWithoutUserInput | ProgrammeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProgrammeScalarWhereInput | ProgrammeScalarWhereInput[]
  }

  export type ExerciseUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExerciseCreateWithoutUserInput, ExerciseUncheckedCreateWithoutUserInput> | ExerciseCreateWithoutUserInput[] | ExerciseUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExerciseCreateOrConnectWithoutUserInput | ExerciseCreateOrConnectWithoutUserInput[]
    upsert?: ExerciseUpsertWithWhereUniqueWithoutUserInput | ExerciseUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExerciseCreateManyUserInputEnvelope
    set?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
    disconnect?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
    delete?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
    connect?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
    update?: ExerciseUpdateWithWhereUniqueWithoutUserInput | ExerciseUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExerciseUpdateManyWithWhereWithoutUserInput | ExerciseUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExerciseScalarWhereInput | ExerciseScalarWhereInput[]
  }

  export type WorkoutSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkoutSessionCreateWithoutUserInput, WorkoutSessionUncheckedCreateWithoutUserInput> | WorkoutSessionCreateWithoutUserInput[] | WorkoutSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutUserInput | WorkoutSessionCreateOrConnectWithoutUserInput[]
    upsert?: WorkoutSessionUpsertWithWhereUniqueWithoutUserInput | WorkoutSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkoutSessionCreateManyUserInputEnvelope
    set?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    disconnect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    delete?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    connect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    update?: WorkoutSessionUpdateWithWhereUniqueWithoutUserInput | WorkoutSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkoutSessionUpdateManyWithWhereWithoutUserInput | WorkoutSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkoutSessionScalarWhereInput | WorkoutSessionScalarWhereInput[]
  }

  export type SessionExerciseLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionExerciseLogCreateWithoutUserInput, SessionExerciseLogUncheckedCreateWithoutUserInput> | SessionExerciseLogCreateWithoutUserInput[] | SessionExerciseLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutUserInput | SessionExerciseLogCreateOrConnectWithoutUserInput[]
    upsert?: SessionExerciseLogUpsertWithWhereUniqueWithoutUserInput | SessionExerciseLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionExerciseLogCreateManyUserInputEnvelope
    set?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    disconnect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    delete?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    update?: SessionExerciseLogUpdateWithWhereUniqueWithoutUserInput | SessionExerciseLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionExerciseLogUpdateManyWithWhereWithoutUserInput | SessionExerciseLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionExerciseLogScalarWhereInput | SessionExerciseLogScalarWhereInput[]
  }

  export type ExerciseLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExerciseLogCreateWithoutUserInput, ExerciseLogUncheckedCreateWithoutUserInput> | ExerciseLogCreateWithoutUserInput[] | ExerciseLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutUserInput | ExerciseLogCreateOrConnectWithoutUserInput[]
    upsert?: ExerciseLogUpsertWithWhereUniqueWithoutUserInput | ExerciseLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExerciseLogCreateManyUserInputEnvelope
    set?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    disconnect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    delete?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    connect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    update?: ExerciseLogUpdateWithWhereUniqueWithoutUserInput | ExerciseLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExerciseLogUpdateManyWithWhereWithoutUserInput | ExerciseLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExerciseLogScalarWhereInput | ExerciseLogScalarWhereInput[]
  }

  export type FeedbackUpdateManyWithoutUserNestedInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput> | FeedbackCreateWithoutUserInput[] | FeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput | FeedbackCreateOrConnectWithoutUserInput[]
    upsert?: FeedbackUpsertWithWhereUniqueWithoutUserInput | FeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FeedbackCreateManyUserInputEnvelope
    set?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    disconnect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    delete?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    update?: FeedbackUpdateWithWhereUniqueWithoutUserInput | FeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FeedbackUpdateManyWithWhereWithoutUserInput | FeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
  }

  export type ProgrammeActivityLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProgrammeActivityLogCreateWithoutUserInput, ProgrammeActivityLogUncheckedCreateWithoutUserInput> | ProgrammeActivityLogCreateWithoutUserInput[] | ProgrammeActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgrammeActivityLogCreateOrConnectWithoutUserInput | ProgrammeActivityLogCreateOrConnectWithoutUserInput[]
    upsert?: ProgrammeActivityLogUpsertWithWhereUniqueWithoutUserInput | ProgrammeActivityLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProgrammeActivityLogCreateManyUserInputEnvelope
    set?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    disconnect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    delete?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    connect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    update?: ProgrammeActivityLogUpdateWithWhereUniqueWithoutUserInput | ProgrammeActivityLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProgrammeActivityLogUpdateManyWithWhereWithoutUserInput | ProgrammeActivityLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProgrammeActivityLogScalarWhereInput | ProgrammeActivityLogScalarWhereInput[]
  }

  export type ProgrammeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProgrammeCreateWithoutUserInput, ProgrammeUncheckedCreateWithoutUserInput> | ProgrammeCreateWithoutUserInput[] | ProgrammeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgrammeCreateOrConnectWithoutUserInput | ProgrammeCreateOrConnectWithoutUserInput[]
    upsert?: ProgrammeUpsertWithWhereUniqueWithoutUserInput | ProgrammeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProgrammeCreateManyUserInputEnvelope
    set?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
    disconnect?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
    delete?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
    connect?: ProgrammeWhereUniqueInput | ProgrammeWhereUniqueInput[]
    update?: ProgrammeUpdateWithWhereUniqueWithoutUserInput | ProgrammeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProgrammeUpdateManyWithWhereWithoutUserInput | ProgrammeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProgrammeScalarWhereInput | ProgrammeScalarWhereInput[]
  }

  export type ExerciseUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExerciseCreateWithoutUserInput, ExerciseUncheckedCreateWithoutUserInput> | ExerciseCreateWithoutUserInput[] | ExerciseUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExerciseCreateOrConnectWithoutUserInput | ExerciseCreateOrConnectWithoutUserInput[]
    upsert?: ExerciseUpsertWithWhereUniqueWithoutUserInput | ExerciseUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExerciseCreateManyUserInputEnvelope
    set?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
    disconnect?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
    delete?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
    connect?: ExerciseWhereUniqueInput | ExerciseWhereUniqueInput[]
    update?: ExerciseUpdateWithWhereUniqueWithoutUserInput | ExerciseUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExerciseUpdateManyWithWhereWithoutUserInput | ExerciseUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExerciseScalarWhereInput | ExerciseScalarWhereInput[]
  }

  export type WorkoutSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkoutSessionCreateWithoutUserInput, WorkoutSessionUncheckedCreateWithoutUserInput> | WorkoutSessionCreateWithoutUserInput[] | WorkoutSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutUserInput | WorkoutSessionCreateOrConnectWithoutUserInput[]
    upsert?: WorkoutSessionUpsertWithWhereUniqueWithoutUserInput | WorkoutSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkoutSessionCreateManyUserInputEnvelope
    set?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    disconnect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    delete?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    connect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    update?: WorkoutSessionUpdateWithWhereUniqueWithoutUserInput | WorkoutSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkoutSessionUpdateManyWithWhereWithoutUserInput | WorkoutSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkoutSessionScalarWhereInput | WorkoutSessionScalarWhereInput[]
  }

  export type SessionExerciseLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionExerciseLogCreateWithoutUserInput, SessionExerciseLogUncheckedCreateWithoutUserInput> | SessionExerciseLogCreateWithoutUserInput[] | SessionExerciseLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutUserInput | SessionExerciseLogCreateOrConnectWithoutUserInput[]
    upsert?: SessionExerciseLogUpsertWithWhereUniqueWithoutUserInput | SessionExerciseLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionExerciseLogCreateManyUserInputEnvelope
    set?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    disconnect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    delete?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    update?: SessionExerciseLogUpdateWithWhereUniqueWithoutUserInput | SessionExerciseLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionExerciseLogUpdateManyWithWhereWithoutUserInput | SessionExerciseLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionExerciseLogScalarWhereInput | SessionExerciseLogScalarWhereInput[]
  }

  export type ExerciseLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExerciseLogCreateWithoutUserInput, ExerciseLogUncheckedCreateWithoutUserInput> | ExerciseLogCreateWithoutUserInput[] | ExerciseLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutUserInput | ExerciseLogCreateOrConnectWithoutUserInput[]
    upsert?: ExerciseLogUpsertWithWhereUniqueWithoutUserInput | ExerciseLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExerciseLogCreateManyUserInputEnvelope
    set?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    disconnect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    delete?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    connect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    update?: ExerciseLogUpdateWithWhereUniqueWithoutUserInput | ExerciseLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExerciseLogUpdateManyWithWhereWithoutUserInput | ExerciseLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExerciseLogScalarWhereInput | ExerciseLogScalarWhereInput[]
  }

  export type FeedbackUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput> | FeedbackCreateWithoutUserInput[] | FeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput | FeedbackCreateOrConnectWithoutUserInput[]
    upsert?: FeedbackUpsertWithWhereUniqueWithoutUserInput | FeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FeedbackCreateManyUserInputEnvelope
    set?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    disconnect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    delete?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    update?: FeedbackUpdateWithWhereUniqueWithoutUserInput | FeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FeedbackUpdateManyWithWhereWithoutUserInput | FeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
  }

  export type ProgrammeActivityLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProgrammeActivityLogCreateWithoutUserInput, ProgrammeActivityLogUncheckedCreateWithoutUserInput> | ProgrammeActivityLogCreateWithoutUserInput[] | ProgrammeActivityLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProgrammeActivityLogCreateOrConnectWithoutUserInput | ProgrammeActivityLogCreateOrConnectWithoutUserInput[]
    upsert?: ProgrammeActivityLogUpsertWithWhereUniqueWithoutUserInput | ProgrammeActivityLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProgrammeActivityLogCreateManyUserInputEnvelope
    set?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    disconnect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    delete?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    connect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    update?: ProgrammeActivityLogUpdateWithWhereUniqueWithoutUserInput | ProgrammeActivityLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProgrammeActivityLogUpdateManyWithWhereWithoutUserInput | ProgrammeActivityLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProgrammeActivityLogScalarWhereInput | ProgrammeActivityLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutFeedbackEntriesInput = {
    create?: XOR<UserCreateWithoutFeedbackEntriesInput, UserUncheckedCreateWithoutFeedbackEntriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbackEntriesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumFeedbackStatusFieldUpdateOperationsInput = {
    set?: $Enums.FeedbackStatus
  }

  export type UserUpdateOneRequiredWithoutFeedbackEntriesNestedInput = {
    create?: XOR<UserCreateWithoutFeedbackEntriesInput, UserUncheckedCreateWithoutFeedbackEntriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbackEntriesInput
    upsert?: UserUpsertWithoutFeedbackEntriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFeedbackEntriesInput, UserUpdateWithoutFeedbackEntriesInput>, UserUncheckedUpdateWithoutFeedbackEntriesInput>
  }

  export type UserCreateNestedOneWithoutExercisesInput = {
    create?: XOR<UserCreateWithoutExercisesInput, UserUncheckedCreateWithoutExercisesInput>
    connectOrCreate?: UserCreateOrConnectWithoutExercisesInput
    connect?: UserWhereUniqueInput
  }

  export type ExerciseWithMetadataCreateNestedManyWithoutExerciseInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutExerciseInput, ExerciseWithMetadataUncheckedCreateWithoutExerciseInput> | ExerciseWithMetadataCreateWithoutExerciseInput[] | ExerciseWithMetadataUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutExerciseInput | ExerciseWithMetadataCreateOrConnectWithoutExerciseInput[]
    createMany?: ExerciseWithMetadataCreateManyExerciseInputEnvelope
    connect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
  }

  export type ExerciseLogCreateNestedManyWithoutExerciseInput = {
    create?: XOR<ExerciseLogCreateWithoutExerciseInput, ExerciseLogUncheckedCreateWithoutExerciseInput> | ExerciseLogCreateWithoutExerciseInput[] | ExerciseLogUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutExerciseInput | ExerciseLogCreateOrConnectWithoutExerciseInput[]
    createMany?: ExerciseLogCreateManyExerciseInputEnvelope
    connect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
  }

  export type ExerciseWithMetadataUncheckedCreateNestedManyWithoutExerciseInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutExerciseInput, ExerciseWithMetadataUncheckedCreateWithoutExerciseInput> | ExerciseWithMetadataCreateWithoutExerciseInput[] | ExerciseWithMetadataUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutExerciseInput | ExerciseWithMetadataCreateOrConnectWithoutExerciseInput[]
    createMany?: ExerciseWithMetadataCreateManyExerciseInputEnvelope
    connect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
  }

  export type ExerciseLogUncheckedCreateNestedManyWithoutExerciseInput = {
    create?: XOR<ExerciseLogCreateWithoutExerciseInput, ExerciseLogUncheckedCreateWithoutExerciseInput> | ExerciseLogCreateWithoutExerciseInput[] | ExerciseLogUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutExerciseInput | ExerciseLogCreateOrConnectWithoutExerciseInput[]
    createMany?: ExerciseLogCreateManyExerciseInputEnvelope
    connect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumMuscleGroupFieldUpdateOperationsInput = {
    set?: $Enums.MuscleGroup
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneWithoutExercisesNestedInput = {
    create?: XOR<UserCreateWithoutExercisesInput, UserUncheckedCreateWithoutExercisesInput>
    connectOrCreate?: UserCreateOrConnectWithoutExercisesInput
    upsert?: UserUpsertWithoutExercisesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExercisesInput, UserUpdateWithoutExercisesInput>, UserUncheckedUpdateWithoutExercisesInput>
  }

  export type ExerciseWithMetadataUpdateManyWithoutExerciseNestedInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutExerciseInput, ExerciseWithMetadataUncheckedCreateWithoutExerciseInput> | ExerciseWithMetadataCreateWithoutExerciseInput[] | ExerciseWithMetadataUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutExerciseInput | ExerciseWithMetadataCreateOrConnectWithoutExerciseInput[]
    upsert?: ExerciseWithMetadataUpsertWithWhereUniqueWithoutExerciseInput | ExerciseWithMetadataUpsertWithWhereUniqueWithoutExerciseInput[]
    createMany?: ExerciseWithMetadataCreateManyExerciseInputEnvelope
    set?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    disconnect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    delete?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    connect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    update?: ExerciseWithMetadataUpdateWithWhereUniqueWithoutExerciseInput | ExerciseWithMetadataUpdateWithWhereUniqueWithoutExerciseInput[]
    updateMany?: ExerciseWithMetadataUpdateManyWithWhereWithoutExerciseInput | ExerciseWithMetadataUpdateManyWithWhereWithoutExerciseInput[]
    deleteMany?: ExerciseWithMetadataScalarWhereInput | ExerciseWithMetadataScalarWhereInput[]
  }

  export type ExerciseLogUpdateManyWithoutExerciseNestedInput = {
    create?: XOR<ExerciseLogCreateWithoutExerciseInput, ExerciseLogUncheckedCreateWithoutExerciseInput> | ExerciseLogCreateWithoutExerciseInput[] | ExerciseLogUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutExerciseInput | ExerciseLogCreateOrConnectWithoutExerciseInput[]
    upsert?: ExerciseLogUpsertWithWhereUniqueWithoutExerciseInput | ExerciseLogUpsertWithWhereUniqueWithoutExerciseInput[]
    createMany?: ExerciseLogCreateManyExerciseInputEnvelope
    set?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    disconnect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    delete?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    connect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    update?: ExerciseLogUpdateWithWhereUniqueWithoutExerciseInput | ExerciseLogUpdateWithWhereUniqueWithoutExerciseInput[]
    updateMany?: ExerciseLogUpdateManyWithWhereWithoutExerciseInput | ExerciseLogUpdateManyWithWhereWithoutExerciseInput[]
    deleteMany?: ExerciseLogScalarWhereInput | ExerciseLogScalarWhereInput[]
  }

  export type ExerciseWithMetadataUncheckedUpdateManyWithoutExerciseNestedInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutExerciseInput, ExerciseWithMetadataUncheckedCreateWithoutExerciseInput> | ExerciseWithMetadataCreateWithoutExerciseInput[] | ExerciseWithMetadataUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutExerciseInput | ExerciseWithMetadataCreateOrConnectWithoutExerciseInput[]
    upsert?: ExerciseWithMetadataUpsertWithWhereUniqueWithoutExerciseInput | ExerciseWithMetadataUpsertWithWhereUniqueWithoutExerciseInput[]
    createMany?: ExerciseWithMetadataCreateManyExerciseInputEnvelope
    set?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    disconnect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    delete?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    connect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    update?: ExerciseWithMetadataUpdateWithWhereUniqueWithoutExerciseInput | ExerciseWithMetadataUpdateWithWhereUniqueWithoutExerciseInput[]
    updateMany?: ExerciseWithMetadataUpdateManyWithWhereWithoutExerciseInput | ExerciseWithMetadataUpdateManyWithWhereWithoutExerciseInput[]
    deleteMany?: ExerciseWithMetadataScalarWhereInput | ExerciseWithMetadataScalarWhereInput[]
  }

  export type ExerciseLogUncheckedUpdateManyWithoutExerciseNestedInput = {
    create?: XOR<ExerciseLogCreateWithoutExerciseInput, ExerciseLogUncheckedCreateWithoutExerciseInput> | ExerciseLogCreateWithoutExerciseInput[] | ExerciseLogUncheckedCreateWithoutExerciseInput[]
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutExerciseInput | ExerciseLogCreateOrConnectWithoutExerciseInput[]
    upsert?: ExerciseLogUpsertWithWhereUniqueWithoutExerciseInput | ExerciseLogUpsertWithWhereUniqueWithoutExerciseInput[]
    createMany?: ExerciseLogCreateManyExerciseInputEnvelope
    set?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    disconnect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    delete?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    connect?: ExerciseLogWhereUniqueInput | ExerciseLogWhereUniqueInput[]
    update?: ExerciseLogUpdateWithWhereUniqueWithoutExerciseInput | ExerciseLogUpdateWithWhereUniqueWithoutExerciseInput[]
    updateMany?: ExerciseLogUpdateManyWithWhereWithoutExerciseInput | ExerciseLogUpdateManyWithWhereWithoutExerciseInput[]
    deleteMany?: ExerciseLogScalarWhereInput | ExerciseLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProgrammesInput = {
    create?: XOR<UserCreateWithoutProgrammesInput, UserUncheckedCreateWithoutProgrammesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgrammesInput
    connect?: UserWhereUniqueInput
  }

  export type WorkoutCreateNestedManyWithoutProgrammeInput = {
    create?: XOR<WorkoutCreateWithoutProgrammeInput, WorkoutUncheckedCreateWithoutProgrammeInput> | WorkoutCreateWithoutProgrammeInput[] | WorkoutUncheckedCreateWithoutProgrammeInput[]
    connectOrCreate?: WorkoutCreateOrConnectWithoutProgrammeInput | WorkoutCreateOrConnectWithoutProgrammeInput[]
    createMany?: WorkoutCreateManyProgrammeInputEnvelope
    connect?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
  }

  export type ProgrammeActivityLogCreateNestedManyWithoutProgrammeInput = {
    create?: XOR<ProgrammeActivityLogCreateWithoutProgrammeInput, ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput> | ProgrammeActivityLogCreateWithoutProgrammeInput[] | ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput[]
    connectOrCreate?: ProgrammeActivityLogCreateOrConnectWithoutProgrammeInput | ProgrammeActivityLogCreateOrConnectWithoutProgrammeInput[]
    createMany?: ProgrammeActivityLogCreateManyProgrammeInputEnvelope
    connect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
  }

  export type WorkoutUncheckedCreateNestedManyWithoutProgrammeInput = {
    create?: XOR<WorkoutCreateWithoutProgrammeInput, WorkoutUncheckedCreateWithoutProgrammeInput> | WorkoutCreateWithoutProgrammeInput[] | WorkoutUncheckedCreateWithoutProgrammeInput[]
    connectOrCreate?: WorkoutCreateOrConnectWithoutProgrammeInput | WorkoutCreateOrConnectWithoutProgrammeInput[]
    createMany?: WorkoutCreateManyProgrammeInputEnvelope
    connect?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
  }

  export type ProgrammeActivityLogUncheckedCreateNestedManyWithoutProgrammeInput = {
    create?: XOR<ProgrammeActivityLogCreateWithoutProgrammeInput, ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput> | ProgrammeActivityLogCreateWithoutProgrammeInput[] | ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput[]
    connectOrCreate?: ProgrammeActivityLogCreateOrConnectWithoutProgrammeInput | ProgrammeActivityLogCreateOrConnectWithoutProgrammeInput[]
    createMany?: ProgrammeActivityLogCreateManyProgrammeInputEnvelope
    connect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutProgrammesNestedInput = {
    create?: XOR<UserCreateWithoutProgrammesInput, UserUncheckedCreateWithoutProgrammesInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgrammesInput
    upsert?: UserUpsertWithoutProgrammesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProgrammesInput, UserUpdateWithoutProgrammesInput>, UserUncheckedUpdateWithoutProgrammesInput>
  }

  export type WorkoutUpdateManyWithoutProgrammeNestedInput = {
    create?: XOR<WorkoutCreateWithoutProgrammeInput, WorkoutUncheckedCreateWithoutProgrammeInput> | WorkoutCreateWithoutProgrammeInput[] | WorkoutUncheckedCreateWithoutProgrammeInput[]
    connectOrCreate?: WorkoutCreateOrConnectWithoutProgrammeInput | WorkoutCreateOrConnectWithoutProgrammeInput[]
    upsert?: WorkoutUpsertWithWhereUniqueWithoutProgrammeInput | WorkoutUpsertWithWhereUniqueWithoutProgrammeInput[]
    createMany?: WorkoutCreateManyProgrammeInputEnvelope
    set?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
    disconnect?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
    delete?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
    connect?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
    update?: WorkoutUpdateWithWhereUniqueWithoutProgrammeInput | WorkoutUpdateWithWhereUniqueWithoutProgrammeInput[]
    updateMany?: WorkoutUpdateManyWithWhereWithoutProgrammeInput | WorkoutUpdateManyWithWhereWithoutProgrammeInput[]
    deleteMany?: WorkoutScalarWhereInput | WorkoutScalarWhereInput[]
  }

  export type ProgrammeActivityLogUpdateManyWithoutProgrammeNestedInput = {
    create?: XOR<ProgrammeActivityLogCreateWithoutProgrammeInput, ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput> | ProgrammeActivityLogCreateWithoutProgrammeInput[] | ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput[]
    connectOrCreate?: ProgrammeActivityLogCreateOrConnectWithoutProgrammeInput | ProgrammeActivityLogCreateOrConnectWithoutProgrammeInput[]
    upsert?: ProgrammeActivityLogUpsertWithWhereUniqueWithoutProgrammeInput | ProgrammeActivityLogUpsertWithWhereUniqueWithoutProgrammeInput[]
    createMany?: ProgrammeActivityLogCreateManyProgrammeInputEnvelope
    set?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    disconnect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    delete?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    connect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    update?: ProgrammeActivityLogUpdateWithWhereUniqueWithoutProgrammeInput | ProgrammeActivityLogUpdateWithWhereUniqueWithoutProgrammeInput[]
    updateMany?: ProgrammeActivityLogUpdateManyWithWhereWithoutProgrammeInput | ProgrammeActivityLogUpdateManyWithWhereWithoutProgrammeInput[]
    deleteMany?: ProgrammeActivityLogScalarWhereInput | ProgrammeActivityLogScalarWhereInput[]
  }

  export type WorkoutUncheckedUpdateManyWithoutProgrammeNestedInput = {
    create?: XOR<WorkoutCreateWithoutProgrammeInput, WorkoutUncheckedCreateWithoutProgrammeInput> | WorkoutCreateWithoutProgrammeInput[] | WorkoutUncheckedCreateWithoutProgrammeInput[]
    connectOrCreate?: WorkoutCreateOrConnectWithoutProgrammeInput | WorkoutCreateOrConnectWithoutProgrammeInput[]
    upsert?: WorkoutUpsertWithWhereUniqueWithoutProgrammeInput | WorkoutUpsertWithWhereUniqueWithoutProgrammeInput[]
    createMany?: WorkoutCreateManyProgrammeInputEnvelope
    set?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
    disconnect?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
    delete?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
    connect?: WorkoutWhereUniqueInput | WorkoutWhereUniqueInput[]
    update?: WorkoutUpdateWithWhereUniqueWithoutProgrammeInput | WorkoutUpdateWithWhereUniqueWithoutProgrammeInput[]
    updateMany?: WorkoutUpdateManyWithWhereWithoutProgrammeInput | WorkoutUpdateManyWithWhereWithoutProgrammeInput[]
    deleteMany?: WorkoutScalarWhereInput | WorkoutScalarWhereInput[]
  }

  export type ProgrammeActivityLogUncheckedUpdateManyWithoutProgrammeNestedInput = {
    create?: XOR<ProgrammeActivityLogCreateWithoutProgrammeInput, ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput> | ProgrammeActivityLogCreateWithoutProgrammeInput[] | ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput[]
    connectOrCreate?: ProgrammeActivityLogCreateOrConnectWithoutProgrammeInput | ProgrammeActivityLogCreateOrConnectWithoutProgrammeInput[]
    upsert?: ProgrammeActivityLogUpsertWithWhereUniqueWithoutProgrammeInput | ProgrammeActivityLogUpsertWithWhereUniqueWithoutProgrammeInput[]
    createMany?: ProgrammeActivityLogCreateManyProgrammeInputEnvelope
    set?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    disconnect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    delete?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    connect?: ProgrammeActivityLogWhereUniqueInput | ProgrammeActivityLogWhereUniqueInput[]
    update?: ProgrammeActivityLogUpdateWithWhereUniqueWithoutProgrammeInput | ProgrammeActivityLogUpdateWithWhereUniqueWithoutProgrammeInput[]
    updateMany?: ProgrammeActivityLogUpdateManyWithWhereWithoutProgrammeInput | ProgrammeActivityLogUpdateManyWithWhereWithoutProgrammeInput[]
    deleteMany?: ProgrammeActivityLogScalarWhereInput | ProgrammeActivityLogScalarWhereInput[]
  }

  export type ProgrammeCreateNestedOneWithoutActivity_logsInput = {
    create?: XOR<ProgrammeCreateWithoutActivity_logsInput, ProgrammeUncheckedCreateWithoutActivity_logsInput>
    connectOrCreate?: ProgrammeCreateOrConnectWithoutActivity_logsInput
    connect?: ProgrammeWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutActivityLogsInput = {
    create?: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivityLogsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProgrammeUpdateOneRequiredWithoutActivity_logsNestedInput = {
    create?: XOR<ProgrammeCreateWithoutActivity_logsInput, ProgrammeUncheckedCreateWithoutActivity_logsInput>
    connectOrCreate?: ProgrammeCreateOrConnectWithoutActivity_logsInput
    upsert?: ProgrammeUpsertWithoutActivity_logsInput
    connect?: ProgrammeWhereUniqueInput
    update?: XOR<XOR<ProgrammeUpdateToOneWithWhereWithoutActivity_logsInput, ProgrammeUpdateWithoutActivity_logsInput>, ProgrammeUncheckedUpdateWithoutActivity_logsInput>
  }

  export type UserUpdateOneRequiredWithoutActivityLogsNestedInput = {
    create?: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutActivityLogsInput
    upsert?: UserUpsertWithoutActivityLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutActivityLogsInput, UserUpdateWithoutActivityLogsInput>, UserUncheckedUpdateWithoutActivityLogsInput>
  }

  export type ProgrammeCreateNestedOneWithoutWorkoutsInput = {
    create?: XOR<ProgrammeCreateWithoutWorkoutsInput, ProgrammeUncheckedCreateWithoutWorkoutsInput>
    connectOrCreate?: ProgrammeCreateOrConnectWithoutWorkoutsInput
    connect?: ProgrammeWhereUniqueInput
  }

  export type ExerciseWithMetadataCreateNestedManyWithoutWorkoutInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutWorkoutInput, ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput> | ExerciseWithMetadataCreateWithoutWorkoutInput[] | ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput[]
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutWorkoutInput | ExerciseWithMetadataCreateOrConnectWithoutWorkoutInput[]
    createMany?: ExerciseWithMetadataCreateManyWorkoutInputEnvelope
    connect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
  }

  export type WorkoutSessionCreateNestedManyWithoutWorkoutInput = {
    create?: XOR<WorkoutSessionCreateWithoutWorkoutInput, WorkoutSessionUncheckedCreateWithoutWorkoutInput> | WorkoutSessionCreateWithoutWorkoutInput[] | WorkoutSessionUncheckedCreateWithoutWorkoutInput[]
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutWorkoutInput | WorkoutSessionCreateOrConnectWithoutWorkoutInput[]
    createMany?: WorkoutSessionCreateManyWorkoutInputEnvelope
    connect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
  }

  export type ExerciseWithMetadataUncheckedCreateNestedManyWithoutWorkoutInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutWorkoutInput, ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput> | ExerciseWithMetadataCreateWithoutWorkoutInput[] | ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput[]
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutWorkoutInput | ExerciseWithMetadataCreateOrConnectWithoutWorkoutInput[]
    createMany?: ExerciseWithMetadataCreateManyWorkoutInputEnvelope
    connect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
  }

  export type WorkoutSessionUncheckedCreateNestedManyWithoutWorkoutInput = {
    create?: XOR<WorkoutSessionCreateWithoutWorkoutInput, WorkoutSessionUncheckedCreateWithoutWorkoutInput> | WorkoutSessionCreateWithoutWorkoutInput[] | WorkoutSessionUncheckedCreateWithoutWorkoutInput[]
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutWorkoutInput | WorkoutSessionCreateOrConnectWithoutWorkoutInput[]
    createMany?: WorkoutSessionCreateManyWorkoutInputEnvelope
    connect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProgrammeUpdateOneRequiredWithoutWorkoutsNestedInput = {
    create?: XOR<ProgrammeCreateWithoutWorkoutsInput, ProgrammeUncheckedCreateWithoutWorkoutsInput>
    connectOrCreate?: ProgrammeCreateOrConnectWithoutWorkoutsInput
    upsert?: ProgrammeUpsertWithoutWorkoutsInput
    connect?: ProgrammeWhereUniqueInput
    update?: XOR<XOR<ProgrammeUpdateToOneWithWhereWithoutWorkoutsInput, ProgrammeUpdateWithoutWorkoutsInput>, ProgrammeUncheckedUpdateWithoutWorkoutsInput>
  }

  export type ExerciseWithMetadataUpdateManyWithoutWorkoutNestedInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutWorkoutInput, ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput> | ExerciseWithMetadataCreateWithoutWorkoutInput[] | ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput[]
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutWorkoutInput | ExerciseWithMetadataCreateOrConnectWithoutWorkoutInput[]
    upsert?: ExerciseWithMetadataUpsertWithWhereUniqueWithoutWorkoutInput | ExerciseWithMetadataUpsertWithWhereUniqueWithoutWorkoutInput[]
    createMany?: ExerciseWithMetadataCreateManyWorkoutInputEnvelope
    set?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    disconnect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    delete?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    connect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    update?: ExerciseWithMetadataUpdateWithWhereUniqueWithoutWorkoutInput | ExerciseWithMetadataUpdateWithWhereUniqueWithoutWorkoutInput[]
    updateMany?: ExerciseWithMetadataUpdateManyWithWhereWithoutWorkoutInput | ExerciseWithMetadataUpdateManyWithWhereWithoutWorkoutInput[]
    deleteMany?: ExerciseWithMetadataScalarWhereInput | ExerciseWithMetadataScalarWhereInput[]
  }

  export type WorkoutSessionUpdateManyWithoutWorkoutNestedInput = {
    create?: XOR<WorkoutSessionCreateWithoutWorkoutInput, WorkoutSessionUncheckedCreateWithoutWorkoutInput> | WorkoutSessionCreateWithoutWorkoutInput[] | WorkoutSessionUncheckedCreateWithoutWorkoutInput[]
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutWorkoutInput | WorkoutSessionCreateOrConnectWithoutWorkoutInput[]
    upsert?: WorkoutSessionUpsertWithWhereUniqueWithoutWorkoutInput | WorkoutSessionUpsertWithWhereUniqueWithoutWorkoutInput[]
    createMany?: WorkoutSessionCreateManyWorkoutInputEnvelope
    set?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    disconnect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    delete?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    connect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    update?: WorkoutSessionUpdateWithWhereUniqueWithoutWorkoutInput | WorkoutSessionUpdateWithWhereUniqueWithoutWorkoutInput[]
    updateMany?: WorkoutSessionUpdateManyWithWhereWithoutWorkoutInput | WorkoutSessionUpdateManyWithWhereWithoutWorkoutInput[]
    deleteMany?: WorkoutSessionScalarWhereInput | WorkoutSessionScalarWhereInput[]
  }

  export type ExerciseWithMetadataUncheckedUpdateManyWithoutWorkoutNestedInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutWorkoutInput, ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput> | ExerciseWithMetadataCreateWithoutWorkoutInput[] | ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput[]
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutWorkoutInput | ExerciseWithMetadataCreateOrConnectWithoutWorkoutInput[]
    upsert?: ExerciseWithMetadataUpsertWithWhereUniqueWithoutWorkoutInput | ExerciseWithMetadataUpsertWithWhereUniqueWithoutWorkoutInput[]
    createMany?: ExerciseWithMetadataCreateManyWorkoutInputEnvelope
    set?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    disconnect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    delete?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    connect?: ExerciseWithMetadataWhereUniqueInput | ExerciseWithMetadataWhereUniqueInput[]
    update?: ExerciseWithMetadataUpdateWithWhereUniqueWithoutWorkoutInput | ExerciseWithMetadataUpdateWithWhereUniqueWithoutWorkoutInput[]
    updateMany?: ExerciseWithMetadataUpdateManyWithWhereWithoutWorkoutInput | ExerciseWithMetadataUpdateManyWithWhereWithoutWorkoutInput[]
    deleteMany?: ExerciseWithMetadataScalarWhereInput | ExerciseWithMetadataScalarWhereInput[]
  }

  export type WorkoutSessionUncheckedUpdateManyWithoutWorkoutNestedInput = {
    create?: XOR<WorkoutSessionCreateWithoutWorkoutInput, WorkoutSessionUncheckedCreateWithoutWorkoutInput> | WorkoutSessionCreateWithoutWorkoutInput[] | WorkoutSessionUncheckedCreateWithoutWorkoutInput[]
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutWorkoutInput | WorkoutSessionCreateOrConnectWithoutWorkoutInput[]
    upsert?: WorkoutSessionUpsertWithWhereUniqueWithoutWorkoutInput | WorkoutSessionUpsertWithWhereUniqueWithoutWorkoutInput[]
    createMany?: WorkoutSessionCreateManyWorkoutInputEnvelope
    set?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    disconnect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    delete?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    connect?: WorkoutSessionWhereUniqueInput | WorkoutSessionWhereUniqueInput[]
    update?: WorkoutSessionUpdateWithWhereUniqueWithoutWorkoutInput | WorkoutSessionUpdateWithWhereUniqueWithoutWorkoutInput[]
    updateMany?: WorkoutSessionUpdateManyWithWhereWithoutWorkoutInput | WorkoutSessionUpdateManyWithWhereWithoutWorkoutInput[]
    deleteMany?: WorkoutSessionScalarWhereInput | WorkoutSessionScalarWhereInput[]
  }

  export type WorkoutCreateNestedOneWithoutWorkoutSessionsInput = {
    create?: XOR<WorkoutCreateWithoutWorkoutSessionsInput, WorkoutUncheckedCreateWithoutWorkoutSessionsInput>
    connectOrCreate?: WorkoutCreateOrConnectWithoutWorkoutSessionsInput
    connect?: WorkoutWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutWorkoutSessionsInput = {
    create?: XOR<UserCreateWithoutWorkoutSessionsInput, UserUncheckedCreateWithoutWorkoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type SessionExerciseLogCreateNestedManyWithoutWorkoutSessionInput = {
    create?: XOR<SessionExerciseLogCreateWithoutWorkoutSessionInput, SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput> | SessionExerciseLogCreateWithoutWorkoutSessionInput[] | SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutWorkoutSessionInput | SessionExerciseLogCreateOrConnectWithoutWorkoutSessionInput[]
    createMany?: SessionExerciseLogCreateManyWorkoutSessionInputEnvelope
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
  }

  export type SessionExerciseLogUncheckedCreateNestedManyWithoutWorkoutSessionInput = {
    create?: XOR<SessionExerciseLogCreateWithoutWorkoutSessionInput, SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput> | SessionExerciseLogCreateWithoutWorkoutSessionInput[] | SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutWorkoutSessionInput | SessionExerciseLogCreateOrConnectWithoutWorkoutSessionInput[]
    createMany?: SessionExerciseLogCreateManyWorkoutSessionInputEnvelope
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
  }

  export type WorkoutUpdateOneWithoutWorkoutSessionsNestedInput = {
    create?: XOR<WorkoutCreateWithoutWorkoutSessionsInput, WorkoutUncheckedCreateWithoutWorkoutSessionsInput>
    connectOrCreate?: WorkoutCreateOrConnectWithoutWorkoutSessionsInput
    upsert?: WorkoutUpsertWithoutWorkoutSessionsInput
    disconnect?: WorkoutWhereInput | boolean
    delete?: WorkoutWhereInput | boolean
    connect?: WorkoutWhereUniqueInput
    update?: XOR<XOR<WorkoutUpdateToOneWithWhereWithoutWorkoutSessionsInput, WorkoutUpdateWithoutWorkoutSessionsInput>, WorkoutUncheckedUpdateWithoutWorkoutSessionsInput>
  }

  export type UserUpdateOneRequiredWithoutWorkoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutWorkoutSessionsInput, UserUncheckedCreateWithoutWorkoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkoutSessionsInput
    upsert?: UserUpsertWithoutWorkoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWorkoutSessionsInput, UserUpdateWithoutWorkoutSessionsInput>, UserUncheckedUpdateWithoutWorkoutSessionsInput>
  }

  export type SessionExerciseLogUpdateManyWithoutWorkoutSessionNestedInput = {
    create?: XOR<SessionExerciseLogCreateWithoutWorkoutSessionInput, SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput> | SessionExerciseLogCreateWithoutWorkoutSessionInput[] | SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutWorkoutSessionInput | SessionExerciseLogCreateOrConnectWithoutWorkoutSessionInput[]
    upsert?: SessionExerciseLogUpsertWithWhereUniqueWithoutWorkoutSessionInput | SessionExerciseLogUpsertWithWhereUniqueWithoutWorkoutSessionInput[]
    createMany?: SessionExerciseLogCreateManyWorkoutSessionInputEnvelope
    set?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    disconnect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    delete?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    update?: SessionExerciseLogUpdateWithWhereUniqueWithoutWorkoutSessionInput | SessionExerciseLogUpdateWithWhereUniqueWithoutWorkoutSessionInput[]
    updateMany?: SessionExerciseLogUpdateManyWithWhereWithoutWorkoutSessionInput | SessionExerciseLogUpdateManyWithWhereWithoutWorkoutSessionInput[]
    deleteMany?: SessionExerciseLogScalarWhereInput | SessionExerciseLogScalarWhereInput[]
  }

  export type SessionExerciseLogUncheckedUpdateManyWithoutWorkoutSessionNestedInput = {
    create?: XOR<SessionExerciseLogCreateWithoutWorkoutSessionInput, SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput> | SessionExerciseLogCreateWithoutWorkoutSessionInput[] | SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutWorkoutSessionInput | SessionExerciseLogCreateOrConnectWithoutWorkoutSessionInput[]
    upsert?: SessionExerciseLogUpsertWithWhereUniqueWithoutWorkoutSessionInput | SessionExerciseLogUpsertWithWhereUniqueWithoutWorkoutSessionInput[]
    createMany?: SessionExerciseLogCreateManyWorkoutSessionInputEnvelope
    set?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    disconnect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    delete?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    update?: SessionExerciseLogUpdateWithWhereUniqueWithoutWorkoutSessionInput | SessionExerciseLogUpdateWithWhereUniqueWithoutWorkoutSessionInput[]
    updateMany?: SessionExerciseLogUpdateManyWithWhereWithoutWorkoutSessionInput | SessionExerciseLogUpdateManyWithWhereWithoutWorkoutSessionInput[]
    deleteMany?: SessionExerciseLogScalarWhereInput | SessionExerciseLogScalarWhereInput[]
  }

  export type ExerciseCreateNestedOneWithoutExercisesWithMetadataInput = {
    create?: XOR<ExerciseCreateWithoutExercisesWithMetadataInput, ExerciseUncheckedCreateWithoutExercisesWithMetadataInput>
    connectOrCreate?: ExerciseCreateOrConnectWithoutExercisesWithMetadataInput
    connect?: ExerciseWhereUniqueInput
  }

  export type WorkoutCreateNestedOneWithoutExercisesWithMetadataInput = {
    create?: XOR<WorkoutCreateWithoutExercisesWithMetadataInput, WorkoutUncheckedCreateWithoutExercisesWithMetadataInput>
    connectOrCreate?: WorkoutCreateOrConnectWithoutExercisesWithMetadataInput
    connect?: WorkoutWhereUniqueInput
  }

  export type SessionExerciseLogCreateNestedManyWithoutExerciseWithMetadataInput = {
    create?: XOR<SessionExerciseLogCreateWithoutExerciseWithMetadataInput, SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput> | SessionExerciseLogCreateWithoutExerciseWithMetadataInput[] | SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutExerciseWithMetadataInput | SessionExerciseLogCreateOrConnectWithoutExerciseWithMetadataInput[]
    createMany?: SessionExerciseLogCreateManyExerciseWithMetadataInputEnvelope
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
  }

  export type SessionExerciseLogUncheckedCreateNestedManyWithoutExerciseWithMetadataInput = {
    create?: XOR<SessionExerciseLogCreateWithoutExerciseWithMetadataInput, SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput> | SessionExerciseLogCreateWithoutExerciseWithMetadataInput[] | SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutExerciseWithMetadataInput | SessionExerciseLogCreateOrConnectWithoutExerciseWithMetadataInput[]
    createMany?: SessionExerciseLogCreateManyExerciseWithMetadataInputEnvelope
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
  }

  export type ExerciseUpdateOneRequiredWithoutExercisesWithMetadataNestedInput = {
    create?: XOR<ExerciseCreateWithoutExercisesWithMetadataInput, ExerciseUncheckedCreateWithoutExercisesWithMetadataInput>
    connectOrCreate?: ExerciseCreateOrConnectWithoutExercisesWithMetadataInput
    upsert?: ExerciseUpsertWithoutExercisesWithMetadataInput
    connect?: ExerciseWhereUniqueInput
    update?: XOR<XOR<ExerciseUpdateToOneWithWhereWithoutExercisesWithMetadataInput, ExerciseUpdateWithoutExercisesWithMetadataInput>, ExerciseUncheckedUpdateWithoutExercisesWithMetadataInput>
  }

  export type WorkoutUpdateOneRequiredWithoutExercisesWithMetadataNestedInput = {
    create?: XOR<WorkoutCreateWithoutExercisesWithMetadataInput, WorkoutUncheckedCreateWithoutExercisesWithMetadataInput>
    connectOrCreate?: WorkoutCreateOrConnectWithoutExercisesWithMetadataInput
    upsert?: WorkoutUpsertWithoutExercisesWithMetadataInput
    connect?: WorkoutWhereUniqueInput
    update?: XOR<XOR<WorkoutUpdateToOneWithWhereWithoutExercisesWithMetadataInput, WorkoutUpdateWithoutExercisesWithMetadataInput>, WorkoutUncheckedUpdateWithoutExercisesWithMetadataInput>
  }

  export type SessionExerciseLogUpdateManyWithoutExerciseWithMetadataNestedInput = {
    create?: XOR<SessionExerciseLogCreateWithoutExerciseWithMetadataInput, SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput> | SessionExerciseLogCreateWithoutExerciseWithMetadataInput[] | SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutExerciseWithMetadataInput | SessionExerciseLogCreateOrConnectWithoutExerciseWithMetadataInput[]
    upsert?: SessionExerciseLogUpsertWithWhereUniqueWithoutExerciseWithMetadataInput | SessionExerciseLogUpsertWithWhereUniqueWithoutExerciseWithMetadataInput[]
    createMany?: SessionExerciseLogCreateManyExerciseWithMetadataInputEnvelope
    set?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    disconnect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    delete?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    update?: SessionExerciseLogUpdateWithWhereUniqueWithoutExerciseWithMetadataInput | SessionExerciseLogUpdateWithWhereUniqueWithoutExerciseWithMetadataInput[]
    updateMany?: SessionExerciseLogUpdateManyWithWhereWithoutExerciseWithMetadataInput | SessionExerciseLogUpdateManyWithWhereWithoutExerciseWithMetadataInput[]
    deleteMany?: SessionExerciseLogScalarWhereInput | SessionExerciseLogScalarWhereInput[]
  }

  export type SessionExerciseLogUncheckedUpdateManyWithoutExerciseWithMetadataNestedInput = {
    create?: XOR<SessionExerciseLogCreateWithoutExerciseWithMetadataInput, SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput> | SessionExerciseLogCreateWithoutExerciseWithMetadataInput[] | SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput[]
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutExerciseWithMetadataInput | SessionExerciseLogCreateOrConnectWithoutExerciseWithMetadataInput[]
    upsert?: SessionExerciseLogUpsertWithWhereUniqueWithoutExerciseWithMetadataInput | SessionExerciseLogUpsertWithWhereUniqueWithoutExerciseWithMetadataInput[]
    createMany?: SessionExerciseLogCreateManyExerciseWithMetadataInputEnvelope
    set?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    disconnect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    delete?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    connect?: SessionExerciseLogWhereUniqueInput | SessionExerciseLogWhereUniqueInput[]
    update?: SessionExerciseLogUpdateWithWhereUniqueWithoutExerciseWithMetadataInput | SessionExerciseLogUpdateWithWhereUniqueWithoutExerciseWithMetadataInput[]
    updateMany?: SessionExerciseLogUpdateManyWithWhereWithoutExerciseWithMetadataInput | SessionExerciseLogUpdateManyWithWhereWithoutExerciseWithMetadataInput[]
    deleteMany?: SessionExerciseLogScalarWhereInput | SessionExerciseLogScalarWhereInput[]
  }

  export type SessionExerciseLogCreateNestedOneWithoutExerciseLogInput = {
    create?: XOR<SessionExerciseLogCreateWithoutExerciseLogInput, SessionExerciseLogUncheckedCreateWithoutExerciseLogInput>
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutExerciseLogInput
    connect?: SessionExerciseLogWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutExerciseLogsInput = {
    create?: XOR<UserCreateWithoutExerciseLogsInput, UserUncheckedCreateWithoutExerciseLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExerciseLogsInput
    connect?: UserWhereUniqueInput
  }

  export type ExerciseCreateNestedOneWithoutExerciseLogsInput = {
    create?: XOR<ExerciseCreateWithoutExerciseLogsInput, ExerciseUncheckedCreateWithoutExerciseLogsInput>
    connectOrCreate?: ExerciseCreateOrConnectWithoutExerciseLogsInput
    connect?: ExerciseWhereUniqueInput
  }

  export type SessionExerciseLogUncheckedCreateNestedOneWithoutExerciseLogInput = {
    create?: XOR<SessionExerciseLogCreateWithoutExerciseLogInput, SessionExerciseLogUncheckedCreateWithoutExerciseLogInput>
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutExerciseLogInput
    connect?: SessionExerciseLogWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SessionExerciseLogUpdateOneWithoutExerciseLogNestedInput = {
    create?: XOR<SessionExerciseLogCreateWithoutExerciseLogInput, SessionExerciseLogUncheckedCreateWithoutExerciseLogInput>
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutExerciseLogInput
    upsert?: SessionExerciseLogUpsertWithoutExerciseLogInput
    disconnect?: SessionExerciseLogWhereInput | boolean
    delete?: SessionExerciseLogWhereInput | boolean
    connect?: SessionExerciseLogWhereUniqueInput
    update?: XOR<XOR<SessionExerciseLogUpdateToOneWithWhereWithoutExerciseLogInput, SessionExerciseLogUpdateWithoutExerciseLogInput>, SessionExerciseLogUncheckedUpdateWithoutExerciseLogInput>
  }

  export type UserUpdateOneRequiredWithoutExerciseLogsNestedInput = {
    create?: XOR<UserCreateWithoutExerciseLogsInput, UserUncheckedCreateWithoutExerciseLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExerciseLogsInput
    upsert?: UserUpsertWithoutExerciseLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExerciseLogsInput, UserUpdateWithoutExerciseLogsInput>, UserUncheckedUpdateWithoutExerciseLogsInput>
  }

  export type ExerciseUpdateOneWithoutExerciseLogsNestedInput = {
    create?: XOR<ExerciseCreateWithoutExerciseLogsInput, ExerciseUncheckedCreateWithoutExerciseLogsInput>
    connectOrCreate?: ExerciseCreateOrConnectWithoutExerciseLogsInput
    upsert?: ExerciseUpsertWithoutExerciseLogsInput
    disconnect?: ExerciseWhereInput | boolean
    delete?: ExerciseWhereInput | boolean
    connect?: ExerciseWhereUniqueInput
    update?: XOR<XOR<ExerciseUpdateToOneWithWhereWithoutExerciseLogsInput, ExerciseUpdateWithoutExerciseLogsInput>, ExerciseUncheckedUpdateWithoutExerciseLogsInput>
  }

  export type SessionExerciseLogUncheckedUpdateOneWithoutExerciseLogNestedInput = {
    create?: XOR<SessionExerciseLogCreateWithoutExerciseLogInput, SessionExerciseLogUncheckedCreateWithoutExerciseLogInput>
    connectOrCreate?: SessionExerciseLogCreateOrConnectWithoutExerciseLogInput
    upsert?: SessionExerciseLogUpsertWithoutExerciseLogInput
    disconnect?: SessionExerciseLogWhereInput | boolean
    delete?: SessionExerciseLogWhereInput | boolean
    connect?: SessionExerciseLogWhereUniqueInput
    update?: XOR<XOR<SessionExerciseLogUpdateToOneWithWhereWithoutExerciseLogInput, SessionExerciseLogUpdateWithoutExerciseLogInput>, SessionExerciseLogUncheckedUpdateWithoutExerciseLogInput>
  }

  export type WorkoutSessionCreateNestedOneWithoutSessionExerciseLogsInput = {
    create?: XOR<WorkoutSessionCreateWithoutSessionExerciseLogsInput, WorkoutSessionUncheckedCreateWithoutSessionExerciseLogsInput>
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutSessionExerciseLogsInput
    connect?: WorkoutSessionWhereUniqueInput
  }

  export type ExerciseWithMetadataCreateNestedOneWithoutSessionExerciseLogsInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutSessionExerciseLogsInput, ExerciseWithMetadataUncheckedCreateWithoutSessionExerciseLogsInput>
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutSessionExerciseLogsInput
    connect?: ExerciseWithMetadataWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSessionExerciseLogsInput = {
    create?: XOR<UserCreateWithoutSessionExerciseLogsInput, UserUncheckedCreateWithoutSessionExerciseLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionExerciseLogsInput
    connect?: UserWhereUniqueInput
  }

  export type ExerciseLogCreateNestedOneWithoutSessionExerciseLogInput = {
    create?: XOR<ExerciseLogCreateWithoutSessionExerciseLogInput, ExerciseLogUncheckedCreateWithoutSessionExerciseLogInput>
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutSessionExerciseLogInput
    connect?: ExerciseLogWhereUniqueInput
  }

  export type WorkoutSessionUpdateOneRequiredWithoutSessionExerciseLogsNestedInput = {
    create?: XOR<WorkoutSessionCreateWithoutSessionExerciseLogsInput, WorkoutSessionUncheckedCreateWithoutSessionExerciseLogsInput>
    connectOrCreate?: WorkoutSessionCreateOrConnectWithoutSessionExerciseLogsInput
    upsert?: WorkoutSessionUpsertWithoutSessionExerciseLogsInput
    connect?: WorkoutSessionWhereUniqueInput
    update?: XOR<XOR<WorkoutSessionUpdateToOneWithWhereWithoutSessionExerciseLogsInput, WorkoutSessionUpdateWithoutSessionExerciseLogsInput>, WorkoutSessionUncheckedUpdateWithoutSessionExerciseLogsInput>
  }

  export type ExerciseWithMetadataUpdateOneWithoutSessionExerciseLogsNestedInput = {
    create?: XOR<ExerciseWithMetadataCreateWithoutSessionExerciseLogsInput, ExerciseWithMetadataUncheckedCreateWithoutSessionExerciseLogsInput>
    connectOrCreate?: ExerciseWithMetadataCreateOrConnectWithoutSessionExerciseLogsInput
    upsert?: ExerciseWithMetadataUpsertWithoutSessionExerciseLogsInput
    disconnect?: ExerciseWithMetadataWhereInput | boolean
    delete?: ExerciseWithMetadataWhereInput | boolean
    connect?: ExerciseWithMetadataWhereUniqueInput
    update?: XOR<XOR<ExerciseWithMetadataUpdateToOneWithWhereWithoutSessionExerciseLogsInput, ExerciseWithMetadataUpdateWithoutSessionExerciseLogsInput>, ExerciseWithMetadataUncheckedUpdateWithoutSessionExerciseLogsInput>
  }

  export type UserUpdateOneRequiredWithoutSessionExerciseLogsNestedInput = {
    create?: XOR<UserCreateWithoutSessionExerciseLogsInput, UserUncheckedCreateWithoutSessionExerciseLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionExerciseLogsInput
    upsert?: UserUpsertWithoutSessionExerciseLogsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionExerciseLogsInput, UserUpdateWithoutSessionExerciseLogsInput>, UserUncheckedUpdateWithoutSessionExerciseLogsInput>
  }

  export type ExerciseLogUpdateOneWithoutSessionExerciseLogNestedInput = {
    create?: XOR<ExerciseLogCreateWithoutSessionExerciseLogInput, ExerciseLogUncheckedCreateWithoutSessionExerciseLogInput>
    connectOrCreate?: ExerciseLogCreateOrConnectWithoutSessionExerciseLogInput
    upsert?: ExerciseLogUpsertWithoutSessionExerciseLogInput
    disconnect?: ExerciseLogWhereInput | boolean
    delete?: ExerciseLogWhereInput | boolean
    connect?: ExerciseLogWhereUniqueInput
    update?: XOR<XOR<ExerciseLogUpdateToOneWithWhereWithoutSessionExerciseLogInput, ExerciseLogUpdateWithoutSessionExerciseLogInput>, ExerciseLogUncheckedUpdateWithoutSessionExerciseLogInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumFeedbackStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackStatus | EnumFeedbackStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackStatus[] | ListEnumFeedbackStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackStatus[] | ListEnumFeedbackStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackStatusFilter<$PrismaModel> | $Enums.FeedbackStatus
  }

  export type NestedEnumFeedbackStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FeedbackStatus | EnumFeedbackStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FeedbackStatus[] | ListEnumFeedbackStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FeedbackStatus[] | ListEnumFeedbackStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFeedbackStatusWithAggregatesFilter<$PrismaModel> | $Enums.FeedbackStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFeedbackStatusFilter<$PrismaModel>
    _max?: NestedEnumFeedbackStatusFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumMuscleGroupFilter<$PrismaModel = never> = {
    equals?: $Enums.MuscleGroup | EnumMuscleGroupFieldRefInput<$PrismaModel>
    in?: $Enums.MuscleGroup[] | ListEnumMuscleGroupFieldRefInput<$PrismaModel>
    notIn?: $Enums.MuscleGroup[] | ListEnumMuscleGroupFieldRefInput<$PrismaModel>
    not?: NestedEnumMuscleGroupFilter<$PrismaModel> | $Enums.MuscleGroup
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumMuscleGroupWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MuscleGroup | EnumMuscleGroupFieldRefInput<$PrismaModel>
    in?: $Enums.MuscleGroup[] | ListEnumMuscleGroupFieldRefInput<$PrismaModel>
    notIn?: $Enums.MuscleGroup[] | ListEnumMuscleGroupFieldRefInput<$PrismaModel>
    not?: NestedEnumMuscleGroupWithAggregatesFilter<$PrismaModel> | $Enums.MuscleGroup
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMuscleGroupFilter<$PrismaModel>
    _max?: NestedEnumMuscleGroupFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ProgrammeCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    is_active?: boolean
    workouts?: WorkoutCreateNestedManyWithoutProgrammeInput
    activity_logs?: ProgrammeActivityLogCreateNestedManyWithoutProgrammeInput
  }

  export type ProgrammeUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    is_active?: boolean
    workouts?: WorkoutUncheckedCreateNestedManyWithoutProgrammeInput
    activity_logs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutProgrammeInput
  }

  export type ProgrammeCreateOrConnectWithoutUserInput = {
    where: ProgrammeWhereUniqueInput
    create: XOR<ProgrammeCreateWithoutUserInput, ProgrammeUncheckedCreateWithoutUserInput>
  }

  export type ProgrammeCreateManyUserInputEnvelope = {
    data: ProgrammeCreateManyUserInput | ProgrammeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ExerciseCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
    exercisesWithMetadata?: ExerciseWithMetadataCreateNestedManyWithoutExerciseInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedCreateNestedManyWithoutExerciseInput
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseCreateOrConnectWithoutUserInput = {
    where: ExerciseWhereUniqueInput
    create: XOR<ExerciseCreateWithoutUserInput, ExerciseUncheckedCreateWithoutUserInput>
  }

  export type ExerciseCreateManyUserInputEnvelope = {
    data: ExerciseCreateManyUserInput | ExerciseCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WorkoutSessionCreateWithoutUserInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    workout?: WorkoutCreateNestedOneWithoutWorkoutSessionsInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutWorkoutSessionInput
  }

  export type WorkoutSessionUncheckedCreateWithoutUserInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    workout_id?: string | null
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutWorkoutSessionInput
  }

  export type WorkoutSessionCreateOrConnectWithoutUserInput = {
    where: WorkoutSessionWhereUniqueInput
    create: XOR<WorkoutSessionCreateWithoutUserInput, WorkoutSessionUncheckedCreateWithoutUserInput>
  }

  export type WorkoutSessionCreateManyUserInputEnvelope = {
    data: WorkoutSessionCreateManyUserInput | WorkoutSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionExerciseLogCreateWithoutUserInput = {
    id?: string
    notes?: string | null
    workoutSession: WorkoutSessionCreateNestedOneWithoutSessionExerciseLogsInput
    exerciseWithMetadata?: ExerciseWithMetadataCreateNestedOneWithoutSessionExerciseLogsInput
    exerciseLog?: ExerciseLogCreateNestedOneWithoutSessionExerciseLogInput
  }

  export type SessionExerciseLogUncheckedCreateWithoutUserInput = {
    id?: string
    notes?: string | null
    workout_session_id: string
    exercise_with_metadata_id?: string | null
    exercise_log_id?: string | null
  }

  export type SessionExerciseLogCreateOrConnectWithoutUserInput = {
    where: SessionExerciseLogWhereUniqueInput
    create: XOR<SessionExerciseLogCreateWithoutUserInput, SessionExerciseLogUncheckedCreateWithoutUserInput>
  }

  export type SessionExerciseLogCreateManyUserInputEnvelope = {
    data: SessionExerciseLogCreateManyUserInput | SessionExerciseLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ExerciseLogCreateWithoutUserInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    sessionExerciseLog?: SessionExerciseLogCreateNestedOneWithoutExerciseLogInput
    exercise?: ExerciseCreateNestedOneWithoutExerciseLogsInput
  }

  export type ExerciseLogUncheckedCreateWithoutUserInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    exerciseId?: string | null
    sessionExerciseLog?: SessionExerciseLogUncheckedCreateNestedOneWithoutExerciseLogInput
  }

  export type ExerciseLogCreateOrConnectWithoutUserInput = {
    where: ExerciseLogWhereUniqueInput
    create: XOR<ExerciseLogCreateWithoutUserInput, ExerciseLogUncheckedCreateWithoutUserInput>
  }

  export type ExerciseLogCreateManyUserInputEnvelope = {
    data: ExerciseLogCreateManyUserInput | ExerciseLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FeedbackCreateWithoutUserInput = {
    id?: string
    description: string
    status?: $Enums.FeedbackStatus
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FeedbackUncheckedCreateWithoutUserInput = {
    id?: string
    description: string
    status?: $Enums.FeedbackStatus
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FeedbackCreateOrConnectWithoutUserInput = {
    where: FeedbackWhereUniqueInput
    create: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
  }

  export type FeedbackCreateManyUserInputEnvelope = {
    data: FeedbackCreateManyUserInput | FeedbackCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProgrammeActivityLogCreateWithoutUserInput = {
    id?: string
    start_time?: Date | string
    end_time?: Date | string | null
    programme: ProgrammeCreateNestedOneWithoutActivity_logsInput
  }

  export type ProgrammeActivityLogUncheckedCreateWithoutUserInput = {
    id?: string
    start_time?: Date | string
    end_time?: Date | string | null
    programme_id: string
  }

  export type ProgrammeActivityLogCreateOrConnectWithoutUserInput = {
    where: ProgrammeActivityLogWhereUniqueInput
    create: XOR<ProgrammeActivityLogCreateWithoutUserInput, ProgrammeActivityLogUncheckedCreateWithoutUserInput>
  }

  export type ProgrammeActivityLogCreateManyUserInputEnvelope = {
    data: ProgrammeActivityLogCreateManyUserInput | ProgrammeActivityLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProgrammeUpsertWithWhereUniqueWithoutUserInput = {
    where: ProgrammeWhereUniqueInput
    update: XOR<ProgrammeUpdateWithoutUserInput, ProgrammeUncheckedUpdateWithoutUserInput>
    create: XOR<ProgrammeCreateWithoutUserInput, ProgrammeUncheckedCreateWithoutUserInput>
  }

  export type ProgrammeUpdateWithWhereUniqueWithoutUserInput = {
    where: ProgrammeWhereUniqueInput
    data: XOR<ProgrammeUpdateWithoutUserInput, ProgrammeUncheckedUpdateWithoutUserInput>
  }

  export type ProgrammeUpdateManyWithWhereWithoutUserInput = {
    where: ProgrammeScalarWhereInput
    data: XOR<ProgrammeUpdateManyMutationInput, ProgrammeUncheckedUpdateManyWithoutUserInput>
  }

  export type ProgrammeScalarWhereInput = {
    AND?: ProgrammeScalarWhereInput | ProgrammeScalarWhereInput[]
    OR?: ProgrammeScalarWhereInput[]
    NOT?: ProgrammeScalarWhereInput | ProgrammeScalarWhereInput[]
    id?: StringFilter<"Programme"> | string
    name?: StringFilter<"Programme"> | string
    description?: StringNullableFilter<"Programme"> | string | null
    user_id?: StringFilter<"Programme"> | string
    is_active?: BoolFilter<"Programme"> | boolean
  }

  export type ExerciseUpsertWithWhereUniqueWithoutUserInput = {
    where: ExerciseWhereUniqueInput
    update: XOR<ExerciseUpdateWithoutUserInput, ExerciseUncheckedUpdateWithoutUserInput>
    create: XOR<ExerciseCreateWithoutUserInput, ExerciseUncheckedCreateWithoutUserInput>
  }

  export type ExerciseUpdateWithWhereUniqueWithoutUserInput = {
    where: ExerciseWhereUniqueInput
    data: XOR<ExerciseUpdateWithoutUserInput, ExerciseUncheckedUpdateWithoutUserInput>
  }

  export type ExerciseUpdateManyWithWhereWithoutUserInput = {
    where: ExerciseScalarWhereInput
    data: XOR<ExerciseUpdateManyMutationInput, ExerciseUncheckedUpdateManyWithoutUserInput>
  }

  export type ExerciseScalarWhereInput = {
    AND?: ExerciseScalarWhereInput | ExerciseScalarWhereInput[]
    OR?: ExerciseScalarWhereInput[]
    NOT?: ExerciseScalarWhereInput | ExerciseScalarWhereInput[]
    id?: StringFilter<"Exercise"> | string
    name?: StringFilter<"Exercise"> | string
    description?: StringNullableFilter<"Exercise"> | string | null
    muscle_group?: EnumMuscleGroupFilter<"Exercise"> | $Enums.MuscleGroup
    is_global?: BoolFilter<"Exercise"> | boolean
    user_id?: StringNullableFilter<"Exercise"> | string | null
  }

  export type WorkoutSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: WorkoutSessionWhereUniqueInput
    update: XOR<WorkoutSessionUpdateWithoutUserInput, WorkoutSessionUncheckedUpdateWithoutUserInput>
    create: XOR<WorkoutSessionCreateWithoutUserInput, WorkoutSessionUncheckedCreateWithoutUserInput>
  }

  export type WorkoutSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: WorkoutSessionWhereUniqueInput
    data: XOR<WorkoutSessionUpdateWithoutUserInput, WorkoutSessionUncheckedUpdateWithoutUserInput>
  }

  export type WorkoutSessionUpdateManyWithWhereWithoutUserInput = {
    where: WorkoutSessionScalarWhereInput
    data: XOR<WorkoutSessionUpdateManyMutationInput, WorkoutSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type WorkoutSessionScalarWhereInput = {
    AND?: WorkoutSessionScalarWhereInput | WorkoutSessionScalarWhereInput[]
    OR?: WorkoutSessionScalarWhereInput[]
    NOT?: WorkoutSessionScalarWhereInput | WorkoutSessionScalarWhereInput[]
    id?: StringFilter<"WorkoutSession"> | string
    start_time?: DateTimeNullableFilter<"WorkoutSession"> | Date | string | null
    end_time?: DateTimeNullableFilter<"WorkoutSession"> | Date | string | null
    notes?: StringNullableFilter<"WorkoutSession"> | string | null
    date?: DateTimeFilter<"WorkoutSession"> | Date | string
    workout_id?: StringNullableFilter<"WorkoutSession"> | string | null
    user_id?: StringFilter<"WorkoutSession"> | string
  }

  export type SessionExerciseLogUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionExerciseLogWhereUniqueInput
    update: XOR<SessionExerciseLogUpdateWithoutUserInput, SessionExerciseLogUncheckedUpdateWithoutUserInput>
    create: XOR<SessionExerciseLogCreateWithoutUserInput, SessionExerciseLogUncheckedCreateWithoutUserInput>
  }

  export type SessionExerciseLogUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionExerciseLogWhereUniqueInput
    data: XOR<SessionExerciseLogUpdateWithoutUserInput, SessionExerciseLogUncheckedUpdateWithoutUserInput>
  }

  export type SessionExerciseLogUpdateManyWithWhereWithoutUserInput = {
    where: SessionExerciseLogScalarWhereInput
    data: XOR<SessionExerciseLogUpdateManyMutationInput, SessionExerciseLogUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionExerciseLogScalarWhereInput = {
    AND?: SessionExerciseLogScalarWhereInput | SessionExerciseLogScalarWhereInput[]
    OR?: SessionExerciseLogScalarWhereInput[]
    NOT?: SessionExerciseLogScalarWhereInput | SessionExerciseLogScalarWhereInput[]
    id?: StringFilter<"SessionExerciseLog"> | string
    notes?: StringNullableFilter<"SessionExerciseLog"> | string | null
    workout_session_id?: StringFilter<"SessionExerciseLog"> | string
    exercise_with_metadata_id?: StringNullableFilter<"SessionExerciseLog"> | string | null
    user_id?: StringFilter<"SessionExerciseLog"> | string
    exercise_log_id?: StringNullableFilter<"SessionExerciseLog"> | string | null
  }

  export type ExerciseLogUpsertWithWhereUniqueWithoutUserInput = {
    where: ExerciseLogWhereUniqueInput
    update: XOR<ExerciseLogUpdateWithoutUserInput, ExerciseLogUncheckedUpdateWithoutUserInput>
    create: XOR<ExerciseLogCreateWithoutUserInput, ExerciseLogUncheckedCreateWithoutUserInput>
  }

  export type ExerciseLogUpdateWithWhereUniqueWithoutUserInput = {
    where: ExerciseLogWhereUniqueInput
    data: XOR<ExerciseLogUpdateWithoutUserInput, ExerciseLogUncheckedUpdateWithoutUserInput>
  }

  export type ExerciseLogUpdateManyWithWhereWithoutUserInput = {
    where: ExerciseLogScalarWhereInput
    data: XOR<ExerciseLogUpdateManyMutationInput, ExerciseLogUncheckedUpdateManyWithoutUserInput>
  }

  export type ExerciseLogScalarWhereInput = {
    AND?: ExerciseLogScalarWhereInput | ExerciseLogScalarWhereInput[]
    OR?: ExerciseLogScalarWhereInput[]
    NOT?: ExerciseLogScalarWhereInput | ExerciseLogScalarWhereInput[]
    id?: StringFilter<"ExerciseLog"> | string
    weight?: FloatNullableFilter<"ExerciseLog"> | number | null
    reps?: IntFilter<"ExerciseLog"> | number
    set_order_index?: IntFilter<"ExerciseLog"> | number
    rpe?: FloatNullableFilter<"ExerciseLog"> | number | null
    date?: DateTimeFilter<"ExerciseLog"> | Date | string
    pr_type?: StringNullableFilter<"ExerciseLog"> | string | null
    user_id?: StringFilter<"ExerciseLog"> | string
    exerciseId?: StringNullableFilter<"ExerciseLog"> | string | null
  }

  export type FeedbackUpsertWithWhereUniqueWithoutUserInput = {
    where: FeedbackWhereUniqueInput
    update: XOR<FeedbackUpdateWithoutUserInput, FeedbackUncheckedUpdateWithoutUserInput>
    create: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
  }

  export type FeedbackUpdateWithWhereUniqueWithoutUserInput = {
    where: FeedbackWhereUniqueInput
    data: XOR<FeedbackUpdateWithoutUserInput, FeedbackUncheckedUpdateWithoutUserInput>
  }

  export type FeedbackUpdateManyWithWhereWithoutUserInput = {
    where: FeedbackScalarWhereInput
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyWithoutUserInput>
  }

  export type FeedbackScalarWhereInput = {
    AND?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
    OR?: FeedbackScalarWhereInput[]
    NOT?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
    id?: StringFilter<"Feedback"> | string
    description?: StringFilter<"Feedback"> | string
    status?: EnumFeedbackStatusFilter<"Feedback"> | $Enums.FeedbackStatus
    created_at?: DateTimeFilter<"Feedback"> | Date | string
    updated_at?: DateTimeFilter<"Feedback"> | Date | string
    user_id?: StringFilter<"Feedback"> | string
  }

  export type ProgrammeActivityLogUpsertWithWhereUniqueWithoutUserInput = {
    where: ProgrammeActivityLogWhereUniqueInput
    update: XOR<ProgrammeActivityLogUpdateWithoutUserInput, ProgrammeActivityLogUncheckedUpdateWithoutUserInput>
    create: XOR<ProgrammeActivityLogCreateWithoutUserInput, ProgrammeActivityLogUncheckedCreateWithoutUserInput>
  }

  export type ProgrammeActivityLogUpdateWithWhereUniqueWithoutUserInput = {
    where: ProgrammeActivityLogWhereUniqueInput
    data: XOR<ProgrammeActivityLogUpdateWithoutUserInput, ProgrammeActivityLogUncheckedUpdateWithoutUserInput>
  }

  export type ProgrammeActivityLogUpdateManyWithWhereWithoutUserInput = {
    where: ProgrammeActivityLogScalarWhereInput
    data: XOR<ProgrammeActivityLogUpdateManyMutationInput, ProgrammeActivityLogUncheckedUpdateManyWithoutUserInput>
  }

  export type ProgrammeActivityLogScalarWhereInput = {
    AND?: ProgrammeActivityLogScalarWhereInput | ProgrammeActivityLogScalarWhereInput[]
    OR?: ProgrammeActivityLogScalarWhereInput[]
    NOT?: ProgrammeActivityLogScalarWhereInput | ProgrammeActivityLogScalarWhereInput[]
    id?: StringFilter<"ProgrammeActivityLog"> | string
    start_time?: DateTimeFilter<"ProgrammeActivityLog"> | Date | string
    end_time?: DateTimeNullableFilter<"ProgrammeActivityLog"> | Date | string | null
    programme_id?: StringFilter<"ProgrammeActivityLog"> | string
    user_id?: StringFilter<"ProgrammeActivityLog"> | string
  }

  export type UserCreateWithoutFeedbackEntriesInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeCreateNestedManyWithoutUserInput
    exercises?: ExerciseCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFeedbackEntriesInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeUncheckedCreateNestedManyWithoutUserInput
    exercises?: ExerciseUncheckedCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFeedbackEntriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFeedbackEntriesInput, UserUncheckedCreateWithoutFeedbackEntriesInput>
  }

  export type UserUpsertWithoutFeedbackEntriesInput = {
    update: XOR<UserUpdateWithoutFeedbackEntriesInput, UserUncheckedUpdateWithoutFeedbackEntriesInput>
    create: XOR<UserCreateWithoutFeedbackEntriesInput, UserUncheckedCreateWithoutFeedbackEntriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFeedbackEntriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFeedbackEntriesInput, UserUncheckedUpdateWithoutFeedbackEntriesInput>
  }

  export type UserUpdateWithoutFeedbackEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFeedbackEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUncheckedUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUncheckedUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutExercisesInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExercisesInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeUncheckedCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExercisesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExercisesInput, UserUncheckedCreateWithoutExercisesInput>
  }

  export type ExerciseWithMetadataCreateWithoutExerciseInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    workout: WorkoutCreateNestedOneWithoutExercisesWithMetadataInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutExerciseWithMetadataInput
  }

  export type ExerciseWithMetadataUncheckedCreateWithoutExerciseInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    workout_id: string
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutExerciseWithMetadataInput
  }

  export type ExerciseWithMetadataCreateOrConnectWithoutExerciseInput = {
    where: ExerciseWithMetadataWhereUniqueInput
    create: XOR<ExerciseWithMetadataCreateWithoutExerciseInput, ExerciseWithMetadataUncheckedCreateWithoutExerciseInput>
  }

  export type ExerciseWithMetadataCreateManyExerciseInputEnvelope = {
    data: ExerciseWithMetadataCreateManyExerciseInput | ExerciseWithMetadataCreateManyExerciseInput[]
    skipDuplicates?: boolean
  }

  export type ExerciseLogCreateWithoutExerciseInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    sessionExerciseLog?: SessionExerciseLogCreateNestedOneWithoutExerciseLogInput
    user: UserCreateNestedOneWithoutExerciseLogsInput
  }

  export type ExerciseLogUncheckedCreateWithoutExerciseInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    user_id: string
    sessionExerciseLog?: SessionExerciseLogUncheckedCreateNestedOneWithoutExerciseLogInput
  }

  export type ExerciseLogCreateOrConnectWithoutExerciseInput = {
    where: ExerciseLogWhereUniqueInput
    create: XOR<ExerciseLogCreateWithoutExerciseInput, ExerciseLogUncheckedCreateWithoutExerciseInput>
  }

  export type ExerciseLogCreateManyExerciseInputEnvelope = {
    data: ExerciseLogCreateManyExerciseInput | ExerciseLogCreateManyExerciseInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutExercisesInput = {
    update: XOR<UserUpdateWithoutExercisesInput, UserUncheckedUpdateWithoutExercisesInput>
    create: XOR<UserCreateWithoutExercisesInput, UserUncheckedCreateWithoutExercisesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExercisesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExercisesInput, UserUncheckedUpdateWithoutExercisesInput>
  }

  export type UserUpdateWithoutExercisesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExercisesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUncheckedUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExerciseWithMetadataUpsertWithWhereUniqueWithoutExerciseInput = {
    where: ExerciseWithMetadataWhereUniqueInput
    update: XOR<ExerciseWithMetadataUpdateWithoutExerciseInput, ExerciseWithMetadataUncheckedUpdateWithoutExerciseInput>
    create: XOR<ExerciseWithMetadataCreateWithoutExerciseInput, ExerciseWithMetadataUncheckedCreateWithoutExerciseInput>
  }

  export type ExerciseWithMetadataUpdateWithWhereUniqueWithoutExerciseInput = {
    where: ExerciseWithMetadataWhereUniqueInput
    data: XOR<ExerciseWithMetadataUpdateWithoutExerciseInput, ExerciseWithMetadataUncheckedUpdateWithoutExerciseInput>
  }

  export type ExerciseWithMetadataUpdateManyWithWhereWithoutExerciseInput = {
    where: ExerciseWithMetadataScalarWhereInput
    data: XOR<ExerciseWithMetadataUpdateManyMutationInput, ExerciseWithMetadataUncheckedUpdateManyWithoutExerciseInput>
  }

  export type ExerciseWithMetadataScalarWhereInput = {
    AND?: ExerciseWithMetadataScalarWhereInput | ExerciseWithMetadataScalarWhereInput[]
    OR?: ExerciseWithMetadataScalarWhereInput[]
    NOT?: ExerciseWithMetadataScalarWhereInput | ExerciseWithMetadataScalarWhereInput[]
    id?: StringFilter<"ExerciseWithMetadata"> | string
    reps_min?: IntFilter<"ExerciseWithMetadata"> | number
    reps_max?: IntFilter<"ExerciseWithMetadata"> | number
    sets_min?: IntFilter<"ExerciseWithMetadata"> | number
    sets_max?: IntFilter<"ExerciseWithMetadata"> | number
    rest_min?: IntFilter<"ExerciseWithMetadata"> | number
    rest_max?: IntFilter<"ExerciseWithMetadata"> | number
    tempo?: StringFilter<"ExerciseWithMetadata"> | string
    order_index?: IntFilter<"ExerciseWithMetadata"> | number
    is_hidden?: BoolFilter<"ExerciseWithMetadata"> | boolean
    exercise_id?: StringFilter<"ExerciseWithMetadata"> | string
    workout_id?: StringFilter<"ExerciseWithMetadata"> | string
  }

  export type ExerciseLogUpsertWithWhereUniqueWithoutExerciseInput = {
    where: ExerciseLogWhereUniqueInput
    update: XOR<ExerciseLogUpdateWithoutExerciseInput, ExerciseLogUncheckedUpdateWithoutExerciseInput>
    create: XOR<ExerciseLogCreateWithoutExerciseInput, ExerciseLogUncheckedCreateWithoutExerciseInput>
  }

  export type ExerciseLogUpdateWithWhereUniqueWithoutExerciseInput = {
    where: ExerciseLogWhereUniqueInput
    data: XOR<ExerciseLogUpdateWithoutExerciseInput, ExerciseLogUncheckedUpdateWithoutExerciseInput>
  }

  export type ExerciseLogUpdateManyWithWhereWithoutExerciseInput = {
    where: ExerciseLogScalarWhereInput
    data: XOR<ExerciseLogUpdateManyMutationInput, ExerciseLogUncheckedUpdateManyWithoutExerciseInput>
  }

  export type UserCreateWithoutProgrammesInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    exercises?: ExerciseCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProgrammesInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    exercises?: ExerciseUncheckedCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProgrammesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProgrammesInput, UserUncheckedCreateWithoutProgrammesInput>
  }

  export type WorkoutCreateWithoutProgrammeInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
    exercisesWithMetadata?: ExerciseWithMetadataCreateNestedManyWithoutWorkoutInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutWorkoutInput
  }

  export type WorkoutUncheckedCreateWithoutProgrammeInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedCreateNestedManyWithoutWorkoutInput
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutWorkoutInput
  }

  export type WorkoutCreateOrConnectWithoutProgrammeInput = {
    where: WorkoutWhereUniqueInput
    create: XOR<WorkoutCreateWithoutProgrammeInput, WorkoutUncheckedCreateWithoutProgrammeInput>
  }

  export type WorkoutCreateManyProgrammeInputEnvelope = {
    data: WorkoutCreateManyProgrammeInput | WorkoutCreateManyProgrammeInput[]
    skipDuplicates?: boolean
  }

  export type ProgrammeActivityLogCreateWithoutProgrammeInput = {
    id?: string
    start_time?: Date | string
    end_time?: Date | string | null
    user: UserCreateNestedOneWithoutActivityLogsInput
  }

  export type ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput = {
    id?: string
    start_time?: Date | string
    end_time?: Date | string | null
    user_id: string
  }

  export type ProgrammeActivityLogCreateOrConnectWithoutProgrammeInput = {
    where: ProgrammeActivityLogWhereUniqueInput
    create: XOR<ProgrammeActivityLogCreateWithoutProgrammeInput, ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput>
  }

  export type ProgrammeActivityLogCreateManyProgrammeInputEnvelope = {
    data: ProgrammeActivityLogCreateManyProgrammeInput | ProgrammeActivityLogCreateManyProgrammeInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutProgrammesInput = {
    update: XOR<UserUpdateWithoutProgrammesInput, UserUncheckedUpdateWithoutProgrammesInput>
    create: XOR<UserCreateWithoutProgrammesInput, UserUncheckedCreateWithoutProgrammesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProgrammesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProgrammesInput, UserUncheckedUpdateWithoutProgrammesInput>
  }

  export type UserUpdateWithoutProgrammesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    exercises?: ExerciseUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProgrammesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    exercises?: ExerciseUncheckedUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WorkoutUpsertWithWhereUniqueWithoutProgrammeInput = {
    where: WorkoutWhereUniqueInput
    update: XOR<WorkoutUpdateWithoutProgrammeInput, WorkoutUncheckedUpdateWithoutProgrammeInput>
    create: XOR<WorkoutCreateWithoutProgrammeInput, WorkoutUncheckedCreateWithoutProgrammeInput>
  }

  export type WorkoutUpdateWithWhereUniqueWithoutProgrammeInput = {
    where: WorkoutWhereUniqueInput
    data: XOR<WorkoutUpdateWithoutProgrammeInput, WorkoutUncheckedUpdateWithoutProgrammeInput>
  }

  export type WorkoutUpdateManyWithWhereWithoutProgrammeInput = {
    where: WorkoutScalarWhereInput
    data: XOR<WorkoutUpdateManyMutationInput, WorkoutUncheckedUpdateManyWithoutProgrammeInput>
  }

  export type WorkoutScalarWhereInput = {
    AND?: WorkoutScalarWhereInput | WorkoutScalarWhereInput[]
    OR?: WorkoutScalarWhereInput[]
    NOT?: WorkoutScalarWhereInput | WorkoutScalarWhereInput[]
    id?: StringFilter<"Workout"> | string
    name?: StringFilter<"Workout"> | string
    description?: StringNullableFilter<"Workout"> | string | null
    order_index?: IntFilter<"Workout"> | number
    programme_id?: StringFilter<"Workout"> | string
  }

  export type ProgrammeActivityLogUpsertWithWhereUniqueWithoutProgrammeInput = {
    where: ProgrammeActivityLogWhereUniqueInput
    update: XOR<ProgrammeActivityLogUpdateWithoutProgrammeInput, ProgrammeActivityLogUncheckedUpdateWithoutProgrammeInput>
    create: XOR<ProgrammeActivityLogCreateWithoutProgrammeInput, ProgrammeActivityLogUncheckedCreateWithoutProgrammeInput>
  }

  export type ProgrammeActivityLogUpdateWithWhereUniqueWithoutProgrammeInput = {
    where: ProgrammeActivityLogWhereUniqueInput
    data: XOR<ProgrammeActivityLogUpdateWithoutProgrammeInput, ProgrammeActivityLogUncheckedUpdateWithoutProgrammeInput>
  }

  export type ProgrammeActivityLogUpdateManyWithWhereWithoutProgrammeInput = {
    where: ProgrammeActivityLogScalarWhereInput
    data: XOR<ProgrammeActivityLogUpdateManyMutationInput, ProgrammeActivityLogUncheckedUpdateManyWithoutProgrammeInput>
  }

  export type ProgrammeCreateWithoutActivity_logsInput = {
    id?: string
    name: string
    description?: string | null
    is_active?: boolean
    user: UserCreateNestedOneWithoutProgrammesInput
    workouts?: WorkoutCreateNestedManyWithoutProgrammeInput
  }

  export type ProgrammeUncheckedCreateWithoutActivity_logsInput = {
    id?: string
    name: string
    description?: string | null
    user_id: string
    is_active?: boolean
    workouts?: WorkoutUncheckedCreateNestedManyWithoutProgrammeInput
  }

  export type ProgrammeCreateOrConnectWithoutActivity_logsInput = {
    where: ProgrammeWhereUniqueInput
    create: XOR<ProgrammeCreateWithoutActivity_logsInput, ProgrammeUncheckedCreateWithoutActivity_logsInput>
  }

  export type UserCreateWithoutActivityLogsInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeCreateNestedManyWithoutUserInput
    exercises?: ExerciseCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutActivityLogsInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeUncheckedCreateNestedManyWithoutUserInput
    exercises?: ExerciseUncheckedCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutActivityLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
  }

  export type ProgrammeUpsertWithoutActivity_logsInput = {
    update: XOR<ProgrammeUpdateWithoutActivity_logsInput, ProgrammeUncheckedUpdateWithoutActivity_logsInput>
    create: XOR<ProgrammeCreateWithoutActivity_logsInput, ProgrammeUncheckedCreateWithoutActivity_logsInput>
    where?: ProgrammeWhereInput
  }

  export type ProgrammeUpdateToOneWithWhereWithoutActivity_logsInput = {
    where?: ProgrammeWhereInput
    data: XOR<ProgrammeUpdateWithoutActivity_logsInput, ProgrammeUncheckedUpdateWithoutActivity_logsInput>
  }

  export type ProgrammeUpdateWithoutActivity_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutProgrammesNestedInput
    workouts?: WorkoutUpdateManyWithoutProgrammeNestedInput
  }

  export type ProgrammeUncheckedUpdateWithoutActivity_logsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    workouts?: WorkoutUncheckedUpdateManyWithoutProgrammeNestedInput
  }

  export type UserUpsertWithoutActivityLogsInput = {
    update: XOR<UserUpdateWithoutActivityLogsInput, UserUncheckedUpdateWithoutActivityLogsInput>
    create: XOR<UserCreateWithoutActivityLogsInput, UserUncheckedCreateWithoutActivityLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutActivityLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutActivityLogsInput, UserUncheckedUpdateWithoutActivityLogsInput>
  }

  export type UserUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUncheckedUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUncheckedUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProgrammeCreateWithoutWorkoutsInput = {
    id?: string
    name: string
    description?: string | null
    is_active?: boolean
    user: UserCreateNestedOneWithoutProgrammesInput
    activity_logs?: ProgrammeActivityLogCreateNestedManyWithoutProgrammeInput
  }

  export type ProgrammeUncheckedCreateWithoutWorkoutsInput = {
    id?: string
    name: string
    description?: string | null
    user_id: string
    is_active?: boolean
    activity_logs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutProgrammeInput
  }

  export type ProgrammeCreateOrConnectWithoutWorkoutsInput = {
    where: ProgrammeWhereUniqueInput
    create: XOR<ProgrammeCreateWithoutWorkoutsInput, ProgrammeUncheckedCreateWithoutWorkoutsInput>
  }

  export type ExerciseWithMetadataCreateWithoutWorkoutInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    exercise: ExerciseCreateNestedOneWithoutExercisesWithMetadataInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutExerciseWithMetadataInput
  }

  export type ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    exercise_id: string
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutExerciseWithMetadataInput
  }

  export type ExerciseWithMetadataCreateOrConnectWithoutWorkoutInput = {
    where: ExerciseWithMetadataWhereUniqueInput
    create: XOR<ExerciseWithMetadataCreateWithoutWorkoutInput, ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput>
  }

  export type ExerciseWithMetadataCreateManyWorkoutInputEnvelope = {
    data: ExerciseWithMetadataCreateManyWorkoutInput | ExerciseWithMetadataCreateManyWorkoutInput[]
    skipDuplicates?: boolean
  }

  export type WorkoutSessionCreateWithoutWorkoutInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    user: UserCreateNestedOneWithoutWorkoutSessionsInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutWorkoutSessionInput
  }

  export type WorkoutSessionUncheckedCreateWithoutWorkoutInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    user_id: string
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutWorkoutSessionInput
  }

  export type WorkoutSessionCreateOrConnectWithoutWorkoutInput = {
    where: WorkoutSessionWhereUniqueInput
    create: XOR<WorkoutSessionCreateWithoutWorkoutInput, WorkoutSessionUncheckedCreateWithoutWorkoutInput>
  }

  export type WorkoutSessionCreateManyWorkoutInputEnvelope = {
    data: WorkoutSessionCreateManyWorkoutInput | WorkoutSessionCreateManyWorkoutInput[]
    skipDuplicates?: boolean
  }

  export type ProgrammeUpsertWithoutWorkoutsInput = {
    update: XOR<ProgrammeUpdateWithoutWorkoutsInput, ProgrammeUncheckedUpdateWithoutWorkoutsInput>
    create: XOR<ProgrammeCreateWithoutWorkoutsInput, ProgrammeUncheckedCreateWithoutWorkoutsInput>
    where?: ProgrammeWhereInput
  }

  export type ProgrammeUpdateToOneWithWhereWithoutWorkoutsInput = {
    where?: ProgrammeWhereInput
    data: XOR<ProgrammeUpdateWithoutWorkoutsInput, ProgrammeUncheckedUpdateWithoutWorkoutsInput>
  }

  export type ProgrammeUpdateWithoutWorkoutsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutProgrammesNestedInput
    activity_logs?: ProgrammeActivityLogUpdateManyWithoutProgrammeNestedInput
  }

  export type ProgrammeUncheckedUpdateWithoutWorkoutsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    is_active?: BoolFieldUpdateOperationsInput | boolean
    activity_logs?: ProgrammeActivityLogUncheckedUpdateManyWithoutProgrammeNestedInput
  }

  export type ExerciseWithMetadataUpsertWithWhereUniqueWithoutWorkoutInput = {
    where: ExerciseWithMetadataWhereUniqueInput
    update: XOR<ExerciseWithMetadataUpdateWithoutWorkoutInput, ExerciseWithMetadataUncheckedUpdateWithoutWorkoutInput>
    create: XOR<ExerciseWithMetadataCreateWithoutWorkoutInput, ExerciseWithMetadataUncheckedCreateWithoutWorkoutInput>
  }

  export type ExerciseWithMetadataUpdateWithWhereUniqueWithoutWorkoutInput = {
    where: ExerciseWithMetadataWhereUniqueInput
    data: XOR<ExerciseWithMetadataUpdateWithoutWorkoutInput, ExerciseWithMetadataUncheckedUpdateWithoutWorkoutInput>
  }

  export type ExerciseWithMetadataUpdateManyWithWhereWithoutWorkoutInput = {
    where: ExerciseWithMetadataScalarWhereInput
    data: XOR<ExerciseWithMetadataUpdateManyMutationInput, ExerciseWithMetadataUncheckedUpdateManyWithoutWorkoutInput>
  }

  export type WorkoutSessionUpsertWithWhereUniqueWithoutWorkoutInput = {
    where: WorkoutSessionWhereUniqueInput
    update: XOR<WorkoutSessionUpdateWithoutWorkoutInput, WorkoutSessionUncheckedUpdateWithoutWorkoutInput>
    create: XOR<WorkoutSessionCreateWithoutWorkoutInput, WorkoutSessionUncheckedCreateWithoutWorkoutInput>
  }

  export type WorkoutSessionUpdateWithWhereUniqueWithoutWorkoutInput = {
    where: WorkoutSessionWhereUniqueInput
    data: XOR<WorkoutSessionUpdateWithoutWorkoutInput, WorkoutSessionUncheckedUpdateWithoutWorkoutInput>
  }

  export type WorkoutSessionUpdateManyWithWhereWithoutWorkoutInput = {
    where: WorkoutSessionScalarWhereInput
    data: XOR<WorkoutSessionUpdateManyMutationInput, WorkoutSessionUncheckedUpdateManyWithoutWorkoutInput>
  }

  export type WorkoutCreateWithoutWorkoutSessionsInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
    programme: ProgrammeCreateNestedOneWithoutWorkoutsInput
    exercisesWithMetadata?: ExerciseWithMetadataCreateNestedManyWithoutWorkoutInput
  }

  export type WorkoutUncheckedCreateWithoutWorkoutSessionsInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
    programme_id: string
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedCreateNestedManyWithoutWorkoutInput
  }

  export type WorkoutCreateOrConnectWithoutWorkoutSessionsInput = {
    where: WorkoutWhereUniqueInput
    create: XOR<WorkoutCreateWithoutWorkoutSessionsInput, WorkoutUncheckedCreateWithoutWorkoutSessionsInput>
  }

  export type UserCreateWithoutWorkoutSessionsInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeCreateNestedManyWithoutUserInput
    exercises?: ExerciseCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWorkoutSessionsInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeUncheckedCreateNestedManyWithoutUserInput
    exercises?: ExerciseUncheckedCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWorkoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWorkoutSessionsInput, UserUncheckedCreateWithoutWorkoutSessionsInput>
  }

  export type SessionExerciseLogCreateWithoutWorkoutSessionInput = {
    id?: string
    notes?: string | null
    exerciseWithMetadata?: ExerciseWithMetadataCreateNestedOneWithoutSessionExerciseLogsInput
    user: UserCreateNestedOneWithoutSessionExerciseLogsInput
    exerciseLog?: ExerciseLogCreateNestedOneWithoutSessionExerciseLogInput
  }

  export type SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput = {
    id?: string
    notes?: string | null
    exercise_with_metadata_id?: string | null
    user_id: string
    exercise_log_id?: string | null
  }

  export type SessionExerciseLogCreateOrConnectWithoutWorkoutSessionInput = {
    where: SessionExerciseLogWhereUniqueInput
    create: XOR<SessionExerciseLogCreateWithoutWorkoutSessionInput, SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput>
  }

  export type SessionExerciseLogCreateManyWorkoutSessionInputEnvelope = {
    data: SessionExerciseLogCreateManyWorkoutSessionInput | SessionExerciseLogCreateManyWorkoutSessionInput[]
    skipDuplicates?: boolean
  }

  export type WorkoutUpsertWithoutWorkoutSessionsInput = {
    update: XOR<WorkoutUpdateWithoutWorkoutSessionsInput, WorkoutUncheckedUpdateWithoutWorkoutSessionsInput>
    create: XOR<WorkoutCreateWithoutWorkoutSessionsInput, WorkoutUncheckedCreateWithoutWorkoutSessionsInput>
    where?: WorkoutWhereInput
  }

  export type WorkoutUpdateToOneWithWhereWithoutWorkoutSessionsInput = {
    where?: WorkoutWhereInput
    data: XOR<WorkoutUpdateWithoutWorkoutSessionsInput, WorkoutUncheckedUpdateWithoutWorkoutSessionsInput>
  }

  export type WorkoutUpdateWithoutWorkoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
    programme?: ProgrammeUpdateOneRequiredWithoutWorkoutsNestedInput
    exercisesWithMetadata?: ExerciseWithMetadataUpdateManyWithoutWorkoutNestedInput
  }

  export type WorkoutUncheckedUpdateWithoutWorkoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
    programme_id?: StringFieldUpdateOperationsInput | string
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedUpdateManyWithoutWorkoutNestedInput
  }

  export type UserUpsertWithoutWorkoutSessionsInput = {
    update: XOR<UserUpdateWithoutWorkoutSessionsInput, UserUncheckedUpdateWithoutWorkoutSessionsInput>
    create: XOR<UserCreateWithoutWorkoutSessionsInput, UserUncheckedCreateWithoutWorkoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWorkoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWorkoutSessionsInput, UserUncheckedUpdateWithoutWorkoutSessionsInput>
  }

  export type UserUpdateWithoutWorkoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWorkoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUncheckedUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUncheckedUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SessionExerciseLogUpsertWithWhereUniqueWithoutWorkoutSessionInput = {
    where: SessionExerciseLogWhereUniqueInput
    update: XOR<SessionExerciseLogUpdateWithoutWorkoutSessionInput, SessionExerciseLogUncheckedUpdateWithoutWorkoutSessionInput>
    create: XOR<SessionExerciseLogCreateWithoutWorkoutSessionInput, SessionExerciseLogUncheckedCreateWithoutWorkoutSessionInput>
  }

  export type SessionExerciseLogUpdateWithWhereUniqueWithoutWorkoutSessionInput = {
    where: SessionExerciseLogWhereUniqueInput
    data: XOR<SessionExerciseLogUpdateWithoutWorkoutSessionInput, SessionExerciseLogUncheckedUpdateWithoutWorkoutSessionInput>
  }

  export type SessionExerciseLogUpdateManyWithWhereWithoutWorkoutSessionInput = {
    where: SessionExerciseLogScalarWhereInput
    data: XOR<SessionExerciseLogUpdateManyMutationInput, SessionExerciseLogUncheckedUpdateManyWithoutWorkoutSessionInput>
  }

  export type ExerciseCreateWithoutExercisesWithMetadataInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
    user?: UserCreateNestedOneWithoutExercisesInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseUncheckedCreateWithoutExercisesWithMetadataInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
    user_id?: string | null
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseCreateOrConnectWithoutExercisesWithMetadataInput = {
    where: ExerciseWhereUniqueInput
    create: XOR<ExerciseCreateWithoutExercisesWithMetadataInput, ExerciseUncheckedCreateWithoutExercisesWithMetadataInput>
  }

  export type WorkoutCreateWithoutExercisesWithMetadataInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
    programme: ProgrammeCreateNestedOneWithoutWorkoutsInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutWorkoutInput
  }

  export type WorkoutUncheckedCreateWithoutExercisesWithMetadataInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
    programme_id: string
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutWorkoutInput
  }

  export type WorkoutCreateOrConnectWithoutExercisesWithMetadataInput = {
    where: WorkoutWhereUniqueInput
    create: XOR<WorkoutCreateWithoutExercisesWithMetadataInput, WorkoutUncheckedCreateWithoutExercisesWithMetadataInput>
  }

  export type SessionExerciseLogCreateWithoutExerciseWithMetadataInput = {
    id?: string
    notes?: string | null
    workoutSession: WorkoutSessionCreateNestedOneWithoutSessionExerciseLogsInput
    user: UserCreateNestedOneWithoutSessionExerciseLogsInput
    exerciseLog?: ExerciseLogCreateNestedOneWithoutSessionExerciseLogInput
  }

  export type SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput = {
    id?: string
    notes?: string | null
    workout_session_id: string
    user_id: string
    exercise_log_id?: string | null
  }

  export type SessionExerciseLogCreateOrConnectWithoutExerciseWithMetadataInput = {
    where: SessionExerciseLogWhereUniqueInput
    create: XOR<SessionExerciseLogCreateWithoutExerciseWithMetadataInput, SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput>
  }

  export type SessionExerciseLogCreateManyExerciseWithMetadataInputEnvelope = {
    data: SessionExerciseLogCreateManyExerciseWithMetadataInput | SessionExerciseLogCreateManyExerciseWithMetadataInput[]
    skipDuplicates?: boolean
  }

  export type ExerciseUpsertWithoutExercisesWithMetadataInput = {
    update: XOR<ExerciseUpdateWithoutExercisesWithMetadataInput, ExerciseUncheckedUpdateWithoutExercisesWithMetadataInput>
    create: XOR<ExerciseCreateWithoutExercisesWithMetadataInput, ExerciseUncheckedCreateWithoutExercisesWithMetadataInput>
    where?: ExerciseWhereInput
  }

  export type ExerciseUpdateToOneWithWhereWithoutExercisesWithMetadataInput = {
    where?: ExerciseWhereInput
    data: XOR<ExerciseUpdateWithoutExercisesWithMetadataInput, ExerciseUncheckedUpdateWithoutExercisesWithMetadataInput>
  }

  export type ExerciseUpdateWithoutExercisesWithMetadataInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneWithoutExercisesNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseUncheckedUpdateWithoutExercisesWithMetadataInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutExerciseNestedInput
  }

  export type WorkoutUpsertWithoutExercisesWithMetadataInput = {
    update: XOR<WorkoutUpdateWithoutExercisesWithMetadataInput, WorkoutUncheckedUpdateWithoutExercisesWithMetadataInput>
    create: XOR<WorkoutCreateWithoutExercisesWithMetadataInput, WorkoutUncheckedCreateWithoutExercisesWithMetadataInput>
    where?: WorkoutWhereInput
  }

  export type WorkoutUpdateToOneWithWhereWithoutExercisesWithMetadataInput = {
    where?: WorkoutWhereInput
    data: XOR<WorkoutUpdateWithoutExercisesWithMetadataInput, WorkoutUncheckedUpdateWithoutExercisesWithMetadataInput>
  }

  export type WorkoutUpdateWithoutExercisesWithMetadataInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
    programme?: ProgrammeUpdateOneRequiredWithoutWorkoutsNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutWorkoutNestedInput
  }

  export type WorkoutUncheckedUpdateWithoutExercisesWithMetadataInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
    programme_id?: StringFieldUpdateOperationsInput | string
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutWorkoutNestedInput
  }

  export type SessionExerciseLogUpsertWithWhereUniqueWithoutExerciseWithMetadataInput = {
    where: SessionExerciseLogWhereUniqueInput
    update: XOR<SessionExerciseLogUpdateWithoutExerciseWithMetadataInput, SessionExerciseLogUncheckedUpdateWithoutExerciseWithMetadataInput>
    create: XOR<SessionExerciseLogCreateWithoutExerciseWithMetadataInput, SessionExerciseLogUncheckedCreateWithoutExerciseWithMetadataInput>
  }

  export type SessionExerciseLogUpdateWithWhereUniqueWithoutExerciseWithMetadataInput = {
    where: SessionExerciseLogWhereUniqueInput
    data: XOR<SessionExerciseLogUpdateWithoutExerciseWithMetadataInput, SessionExerciseLogUncheckedUpdateWithoutExerciseWithMetadataInput>
  }

  export type SessionExerciseLogUpdateManyWithWhereWithoutExerciseWithMetadataInput = {
    where: SessionExerciseLogScalarWhereInput
    data: XOR<SessionExerciseLogUpdateManyMutationInput, SessionExerciseLogUncheckedUpdateManyWithoutExerciseWithMetadataInput>
  }

  export type SessionExerciseLogCreateWithoutExerciseLogInput = {
    id?: string
    notes?: string | null
    workoutSession: WorkoutSessionCreateNestedOneWithoutSessionExerciseLogsInput
    exerciseWithMetadata?: ExerciseWithMetadataCreateNestedOneWithoutSessionExerciseLogsInput
    user: UserCreateNestedOneWithoutSessionExerciseLogsInput
  }

  export type SessionExerciseLogUncheckedCreateWithoutExerciseLogInput = {
    id?: string
    notes?: string | null
    workout_session_id: string
    exercise_with_metadata_id?: string | null
    user_id: string
  }

  export type SessionExerciseLogCreateOrConnectWithoutExerciseLogInput = {
    where: SessionExerciseLogWhereUniqueInput
    create: XOR<SessionExerciseLogCreateWithoutExerciseLogInput, SessionExerciseLogUncheckedCreateWithoutExerciseLogInput>
  }

  export type UserCreateWithoutExerciseLogsInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeCreateNestedManyWithoutUserInput
    exercises?: ExerciseCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExerciseLogsInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeUncheckedCreateNestedManyWithoutUserInput
    exercises?: ExerciseUncheckedCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutUserInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExerciseLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExerciseLogsInput, UserUncheckedCreateWithoutExerciseLogsInput>
  }

  export type ExerciseCreateWithoutExerciseLogsInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
    user?: UserCreateNestedOneWithoutExercisesInput
    exercisesWithMetadata?: ExerciseWithMetadataCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseUncheckedCreateWithoutExerciseLogsInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
    user_id?: string | null
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedCreateNestedManyWithoutExerciseInput
  }

  export type ExerciseCreateOrConnectWithoutExerciseLogsInput = {
    where: ExerciseWhereUniqueInput
    create: XOR<ExerciseCreateWithoutExerciseLogsInput, ExerciseUncheckedCreateWithoutExerciseLogsInput>
  }

  export type SessionExerciseLogUpsertWithoutExerciseLogInput = {
    update: XOR<SessionExerciseLogUpdateWithoutExerciseLogInput, SessionExerciseLogUncheckedUpdateWithoutExerciseLogInput>
    create: XOR<SessionExerciseLogCreateWithoutExerciseLogInput, SessionExerciseLogUncheckedCreateWithoutExerciseLogInput>
    where?: SessionExerciseLogWhereInput
  }

  export type SessionExerciseLogUpdateToOneWithWhereWithoutExerciseLogInput = {
    where?: SessionExerciseLogWhereInput
    data: XOR<SessionExerciseLogUpdateWithoutExerciseLogInput, SessionExerciseLogUncheckedUpdateWithoutExerciseLogInput>
  }

  export type SessionExerciseLogUpdateWithoutExerciseLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workoutSession?: WorkoutSessionUpdateOneRequiredWithoutSessionExerciseLogsNestedInput
    exerciseWithMetadata?: ExerciseWithMetadataUpdateOneWithoutSessionExerciseLogsNestedInput
    user?: UserUpdateOneRequiredWithoutSessionExerciseLogsNestedInput
  }

  export type SessionExerciseLogUncheckedUpdateWithoutExerciseLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workout_session_id?: StringFieldUpdateOperationsInput | string
    exercise_with_metadata_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpsertWithoutExerciseLogsInput = {
    update: XOR<UserUpdateWithoutExerciseLogsInput, UserUncheckedUpdateWithoutExerciseLogsInput>
    create: XOR<UserCreateWithoutExerciseLogsInput, UserUncheckedCreateWithoutExerciseLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExerciseLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExerciseLogsInput, UserUncheckedUpdateWithoutExerciseLogsInput>
  }

  export type UserUpdateWithoutExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUncheckedUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUncheckedUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutUserNestedInput
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExerciseUpsertWithoutExerciseLogsInput = {
    update: XOR<ExerciseUpdateWithoutExerciseLogsInput, ExerciseUncheckedUpdateWithoutExerciseLogsInput>
    create: XOR<ExerciseCreateWithoutExerciseLogsInput, ExerciseUncheckedCreateWithoutExerciseLogsInput>
    where?: ExerciseWhereInput
  }

  export type ExerciseUpdateToOneWithWhereWithoutExerciseLogsInput = {
    where?: ExerciseWhereInput
    data: XOR<ExerciseUpdateWithoutExerciseLogsInput, ExerciseUncheckedUpdateWithoutExerciseLogsInput>
  }

  export type ExerciseUpdateWithoutExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneWithoutExercisesNestedInput
    exercisesWithMetadata?: ExerciseWithMetadataUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseUncheckedUpdateWithoutExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
    user_id?: NullableStringFieldUpdateOperationsInput | string | null
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedUpdateManyWithoutExerciseNestedInput
  }

  export type WorkoutSessionCreateWithoutSessionExerciseLogsInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    workout?: WorkoutCreateNestedOneWithoutWorkoutSessionsInput
    user: UserCreateNestedOneWithoutWorkoutSessionsInput
  }

  export type WorkoutSessionUncheckedCreateWithoutSessionExerciseLogsInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    workout_id?: string | null
    user_id: string
  }

  export type WorkoutSessionCreateOrConnectWithoutSessionExerciseLogsInput = {
    where: WorkoutSessionWhereUniqueInput
    create: XOR<WorkoutSessionCreateWithoutSessionExerciseLogsInput, WorkoutSessionUncheckedCreateWithoutSessionExerciseLogsInput>
  }

  export type ExerciseWithMetadataCreateWithoutSessionExerciseLogsInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    exercise: ExerciseCreateNestedOneWithoutExercisesWithMetadataInput
    workout: WorkoutCreateNestedOneWithoutExercisesWithMetadataInput
  }

  export type ExerciseWithMetadataUncheckedCreateWithoutSessionExerciseLogsInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    exercise_id: string
    workout_id: string
  }

  export type ExerciseWithMetadataCreateOrConnectWithoutSessionExerciseLogsInput = {
    where: ExerciseWithMetadataWhereUniqueInput
    create: XOR<ExerciseWithMetadataCreateWithoutSessionExerciseLogsInput, ExerciseWithMetadataUncheckedCreateWithoutSessionExerciseLogsInput>
  }

  export type UserCreateWithoutSessionExerciseLogsInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeCreateNestedManyWithoutUserInput
    exercises?: ExerciseCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionExerciseLogsInput = {
    id?: string
    username: string
    password_hash: string
    created_at?: Date | string
    programmes?: ProgrammeUncheckedCreateNestedManyWithoutUserInput
    exercises?: ExerciseUncheckedCreateNestedManyWithoutUserInput
    workoutSessions?: WorkoutSessionUncheckedCreateNestedManyWithoutUserInput
    exerciseLogs?: ExerciseLogUncheckedCreateNestedManyWithoutUserInput
    feedbackEntries?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    activityLogs?: ProgrammeActivityLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionExerciseLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionExerciseLogsInput, UserUncheckedCreateWithoutSessionExerciseLogsInput>
  }

  export type ExerciseLogCreateWithoutSessionExerciseLogInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    user: UserCreateNestedOneWithoutExerciseLogsInput
    exercise?: ExerciseCreateNestedOneWithoutExerciseLogsInput
  }

  export type ExerciseLogUncheckedCreateWithoutSessionExerciseLogInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    user_id: string
    exerciseId?: string | null
  }

  export type ExerciseLogCreateOrConnectWithoutSessionExerciseLogInput = {
    where: ExerciseLogWhereUniqueInput
    create: XOR<ExerciseLogCreateWithoutSessionExerciseLogInput, ExerciseLogUncheckedCreateWithoutSessionExerciseLogInput>
  }

  export type WorkoutSessionUpsertWithoutSessionExerciseLogsInput = {
    update: XOR<WorkoutSessionUpdateWithoutSessionExerciseLogsInput, WorkoutSessionUncheckedUpdateWithoutSessionExerciseLogsInput>
    create: XOR<WorkoutSessionCreateWithoutSessionExerciseLogsInput, WorkoutSessionUncheckedCreateWithoutSessionExerciseLogsInput>
    where?: WorkoutSessionWhereInput
  }

  export type WorkoutSessionUpdateToOneWithWhereWithoutSessionExerciseLogsInput = {
    where?: WorkoutSessionWhereInput
    data: XOR<WorkoutSessionUpdateWithoutSessionExerciseLogsInput, WorkoutSessionUncheckedUpdateWithoutSessionExerciseLogsInput>
  }

  export type WorkoutSessionUpdateWithoutSessionExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    workout?: WorkoutUpdateOneWithoutWorkoutSessionsNestedInput
    user?: UserUpdateOneRequiredWithoutWorkoutSessionsNestedInput
  }

  export type WorkoutSessionUncheckedUpdateWithoutSessionExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    workout_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type ExerciseWithMetadataUpsertWithoutSessionExerciseLogsInput = {
    update: XOR<ExerciseWithMetadataUpdateWithoutSessionExerciseLogsInput, ExerciseWithMetadataUncheckedUpdateWithoutSessionExerciseLogsInput>
    create: XOR<ExerciseWithMetadataCreateWithoutSessionExerciseLogsInput, ExerciseWithMetadataUncheckedCreateWithoutSessionExerciseLogsInput>
    where?: ExerciseWithMetadataWhereInput
  }

  export type ExerciseWithMetadataUpdateToOneWithWhereWithoutSessionExerciseLogsInput = {
    where?: ExerciseWithMetadataWhereInput
    data: XOR<ExerciseWithMetadataUpdateWithoutSessionExerciseLogsInput, ExerciseWithMetadataUncheckedUpdateWithoutSessionExerciseLogsInput>
  }

  export type ExerciseWithMetadataUpdateWithoutSessionExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    exercise?: ExerciseUpdateOneRequiredWithoutExercisesWithMetadataNestedInput
    workout?: WorkoutUpdateOneRequiredWithoutExercisesWithMetadataNestedInput
  }

  export type ExerciseWithMetadataUncheckedUpdateWithoutSessionExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    exercise_id?: StringFieldUpdateOperationsInput | string
    workout_id?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpsertWithoutSessionExerciseLogsInput = {
    update: XOR<UserUpdateWithoutSessionExerciseLogsInput, UserUncheckedUpdateWithoutSessionExerciseLogsInput>
    create: XOR<UserCreateWithoutSessionExerciseLogsInput, UserUncheckedCreateWithoutSessionExerciseLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionExerciseLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionExerciseLogsInput, UserUncheckedUpdateWithoutSessionExerciseLogsInput>
  }

  export type UserUpdateWithoutSessionExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionExerciseLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    programmes?: ProgrammeUncheckedUpdateManyWithoutUserNestedInput
    exercises?: ExerciseUncheckedUpdateManyWithoutUserNestedInput
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutUserNestedInput
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutUserNestedInput
    feedbackEntries?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    activityLogs?: ProgrammeActivityLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExerciseLogUpsertWithoutSessionExerciseLogInput = {
    update: XOR<ExerciseLogUpdateWithoutSessionExerciseLogInput, ExerciseLogUncheckedUpdateWithoutSessionExerciseLogInput>
    create: XOR<ExerciseLogCreateWithoutSessionExerciseLogInput, ExerciseLogUncheckedCreateWithoutSessionExerciseLogInput>
    where?: ExerciseLogWhereInput
  }

  export type ExerciseLogUpdateToOneWithWhereWithoutSessionExerciseLogInput = {
    where?: ExerciseLogWhereInput
    data: XOR<ExerciseLogUpdateWithoutSessionExerciseLogInput, ExerciseLogUncheckedUpdateWithoutSessionExerciseLogInput>
  }

  export type ExerciseLogUpdateWithoutSessionExerciseLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutExerciseLogsNestedInput
    exercise?: ExerciseUpdateOneWithoutExerciseLogsNestedInput
  }

  export type ExerciseLogUncheckedUpdateWithoutSessionExerciseLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    exerciseId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProgrammeCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    is_active?: boolean
  }

  export type ExerciseCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    muscle_group: $Enums.MuscleGroup
    is_global?: boolean
  }

  export type WorkoutSessionCreateManyUserInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    workout_id?: string | null
  }

  export type SessionExerciseLogCreateManyUserInput = {
    id?: string
    notes?: string | null
    workout_session_id: string
    exercise_with_metadata_id?: string | null
    exercise_log_id?: string | null
  }

  export type ExerciseLogCreateManyUserInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    exerciseId?: string | null
  }

  export type FeedbackCreateManyUserInput = {
    id?: string
    description: string
    status?: $Enums.FeedbackStatus
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProgrammeActivityLogCreateManyUserInput = {
    id?: string
    start_time?: Date | string
    end_time?: Date | string | null
    programme_id: string
  }

  export type ProgrammeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    workouts?: WorkoutUpdateManyWithoutProgrammeNestedInput
    activity_logs?: ProgrammeActivityLogUpdateManyWithoutProgrammeNestedInput
  }

  export type ProgrammeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    workouts?: WorkoutUncheckedUpdateManyWithoutProgrammeNestedInput
    activity_logs?: ProgrammeActivityLogUncheckedUpdateManyWithoutProgrammeNestedInput
  }

  export type ProgrammeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExerciseUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
    exercisesWithMetadata?: ExerciseWithMetadataUpdateManyWithoutExerciseNestedInput
    exerciseLogs?: ExerciseLogUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedUpdateManyWithoutExerciseNestedInput
    exerciseLogs?: ExerciseLogUncheckedUpdateManyWithoutExerciseNestedInput
  }

  export type ExerciseUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    muscle_group?: EnumMuscleGroupFieldUpdateOperationsInput | $Enums.MuscleGroup
    is_global?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkoutSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    workout?: WorkoutUpdateOneWithoutWorkoutSessionsNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutWorkoutSessionNestedInput
  }

  export type WorkoutSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    workout_id?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutWorkoutSessionNestedInput
  }

  export type WorkoutSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    workout_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionExerciseLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workoutSession?: WorkoutSessionUpdateOneRequiredWithoutSessionExerciseLogsNestedInput
    exerciseWithMetadata?: ExerciseWithMetadataUpdateOneWithoutSessionExerciseLogsNestedInput
    exerciseLog?: ExerciseLogUpdateOneWithoutSessionExerciseLogNestedInput
  }

  export type SessionExerciseLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workout_session_id?: StringFieldUpdateOperationsInput | string
    exercise_with_metadata_id?: NullableStringFieldUpdateOperationsInput | string | null
    exercise_log_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionExerciseLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workout_session_id?: StringFieldUpdateOperationsInput | string
    exercise_with_metadata_id?: NullableStringFieldUpdateOperationsInput | string | null
    exercise_log_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ExerciseLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExerciseLog?: SessionExerciseLogUpdateOneWithoutExerciseLogNestedInput
    exercise?: ExerciseUpdateOneWithoutExerciseLogsNestedInput
  }

  export type ExerciseLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    exerciseId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExerciseLog?: SessionExerciseLogUncheckedUpdateOneWithoutExerciseLogNestedInput
  }

  export type ExerciseLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    exerciseId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FeedbackUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumFeedbackStatusFieldUpdateOperationsInput | $Enums.FeedbackStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumFeedbackStatusFieldUpdateOperationsInput | $Enums.FeedbackStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: EnumFeedbackStatusFieldUpdateOperationsInput | $Enums.FeedbackStatus
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProgrammeActivityLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    programme?: ProgrammeUpdateOneRequiredWithoutActivity_logsNestedInput
  }

  export type ProgrammeActivityLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    programme_id?: StringFieldUpdateOperationsInput | string
  }

  export type ProgrammeActivityLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    programme_id?: StringFieldUpdateOperationsInput | string
  }

  export type ExerciseWithMetadataCreateManyExerciseInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    workout_id: string
  }

  export type ExerciseLogCreateManyExerciseInput = {
    id?: string
    weight?: number | null
    reps: number
    set_order_index: number
    rpe?: number | null
    date?: Date | string
    pr_type?: string | null
    user_id: string
  }

  export type ExerciseWithMetadataUpdateWithoutExerciseInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    workout?: WorkoutUpdateOneRequiredWithoutExercisesWithMetadataNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutExerciseWithMetadataNestedInput
  }

  export type ExerciseWithMetadataUncheckedUpdateWithoutExerciseInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    workout_id?: StringFieldUpdateOperationsInput | string
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutExerciseWithMetadataNestedInput
  }

  export type ExerciseWithMetadataUncheckedUpdateManyWithoutExerciseInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    workout_id?: StringFieldUpdateOperationsInput | string
  }

  export type ExerciseLogUpdateWithoutExerciseInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExerciseLog?: SessionExerciseLogUpdateOneWithoutExerciseLogNestedInput
    user?: UserUpdateOneRequiredWithoutExerciseLogsNestedInput
  }

  export type ExerciseLogUncheckedUpdateWithoutExerciseInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    sessionExerciseLog?: SessionExerciseLogUncheckedUpdateOneWithoutExerciseLogNestedInput
  }

  export type ExerciseLogUncheckedUpdateManyWithoutExerciseInput = {
    id?: StringFieldUpdateOperationsInput | string
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    reps?: IntFieldUpdateOperationsInput | number
    set_order_index?: IntFieldUpdateOperationsInput | number
    rpe?: NullableFloatFieldUpdateOperationsInput | number | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    pr_type?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type WorkoutCreateManyProgrammeInput = {
    id?: string
    name: string
    description?: string | null
    order_index: number
  }

  export type ProgrammeActivityLogCreateManyProgrammeInput = {
    id?: string
    start_time?: Date | string
    end_time?: Date | string | null
    user_id: string
  }

  export type WorkoutUpdateWithoutProgrammeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
    exercisesWithMetadata?: ExerciseWithMetadataUpdateManyWithoutWorkoutNestedInput
    workoutSessions?: WorkoutSessionUpdateManyWithoutWorkoutNestedInput
  }

  export type WorkoutUncheckedUpdateWithoutProgrammeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
    exercisesWithMetadata?: ExerciseWithMetadataUncheckedUpdateManyWithoutWorkoutNestedInput
    workoutSessions?: WorkoutSessionUncheckedUpdateManyWithoutWorkoutNestedInput
  }

  export type WorkoutUncheckedUpdateManyWithoutProgrammeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order_index?: IntFieldUpdateOperationsInput | number
  }

  export type ProgrammeActivityLogUpdateWithoutProgrammeInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutActivityLogsNestedInput
  }

  export type ProgrammeActivityLogUncheckedUpdateWithoutProgrammeInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type ProgrammeActivityLogUncheckedUpdateManyWithoutProgrammeInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: DateTimeFieldUpdateOperationsInput | Date | string
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type ExerciseWithMetadataCreateManyWorkoutInput = {
    id?: string
    reps_min: number
    reps_max: number
    sets_min: number
    sets_max: number
    rest_min: number
    rest_max: number
    tempo: string
    order_index: number
    is_hidden?: boolean
    exercise_id: string
  }

  export type WorkoutSessionCreateManyWorkoutInput = {
    id?: string
    start_time?: Date | string | null
    end_time?: Date | string | null
    notes?: string | null
    date?: Date | string
    user_id: string
  }

  export type ExerciseWithMetadataUpdateWithoutWorkoutInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    exercise?: ExerciseUpdateOneRequiredWithoutExercisesWithMetadataNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutExerciseWithMetadataNestedInput
  }

  export type ExerciseWithMetadataUncheckedUpdateWithoutWorkoutInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    exercise_id?: StringFieldUpdateOperationsInput | string
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutExerciseWithMetadataNestedInput
  }

  export type ExerciseWithMetadataUncheckedUpdateManyWithoutWorkoutInput = {
    id?: StringFieldUpdateOperationsInput | string
    reps_min?: IntFieldUpdateOperationsInput | number
    reps_max?: IntFieldUpdateOperationsInput | number
    sets_min?: IntFieldUpdateOperationsInput | number
    sets_max?: IntFieldUpdateOperationsInput | number
    rest_min?: IntFieldUpdateOperationsInput | number
    rest_max?: IntFieldUpdateOperationsInput | number
    tempo?: StringFieldUpdateOperationsInput | string
    order_index?: IntFieldUpdateOperationsInput | number
    is_hidden?: BoolFieldUpdateOperationsInput | boolean
    exercise_id?: StringFieldUpdateOperationsInput | string
  }

  export type WorkoutSessionUpdateWithoutWorkoutInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWorkoutSessionsNestedInput
    sessionExerciseLogs?: SessionExerciseLogUpdateManyWithoutWorkoutSessionNestedInput
  }

  export type WorkoutSessionUncheckedUpdateWithoutWorkoutInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    sessionExerciseLogs?: SessionExerciseLogUncheckedUpdateManyWithoutWorkoutSessionNestedInput
  }

  export type WorkoutSessionUncheckedUpdateManyWithoutWorkoutInput = {
    id?: StringFieldUpdateOperationsInput | string
    start_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    end_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type SessionExerciseLogCreateManyWorkoutSessionInput = {
    id?: string
    notes?: string | null
    exercise_with_metadata_id?: string | null
    user_id: string
    exercise_log_id?: string | null
  }

  export type SessionExerciseLogUpdateWithoutWorkoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    exerciseWithMetadata?: ExerciseWithMetadataUpdateOneWithoutSessionExerciseLogsNestedInput
    user?: UserUpdateOneRequiredWithoutSessionExerciseLogsNestedInput
    exerciseLog?: ExerciseLogUpdateOneWithoutSessionExerciseLogNestedInput
  }

  export type SessionExerciseLogUncheckedUpdateWithoutWorkoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    exercise_with_metadata_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    exercise_log_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionExerciseLogUncheckedUpdateManyWithoutWorkoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    exercise_with_metadata_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_id?: StringFieldUpdateOperationsInput | string
    exercise_log_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionExerciseLogCreateManyExerciseWithMetadataInput = {
    id?: string
    notes?: string | null
    workout_session_id: string
    user_id: string
    exercise_log_id?: string | null
  }

  export type SessionExerciseLogUpdateWithoutExerciseWithMetadataInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workoutSession?: WorkoutSessionUpdateOneRequiredWithoutSessionExerciseLogsNestedInput
    user?: UserUpdateOneRequiredWithoutSessionExerciseLogsNestedInput
    exerciseLog?: ExerciseLogUpdateOneWithoutSessionExerciseLogNestedInput
  }

  export type SessionExerciseLogUncheckedUpdateWithoutExerciseWithMetadataInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workout_session_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    exercise_log_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionExerciseLogUncheckedUpdateManyWithoutExerciseWithMetadataInput = {
    id?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    workout_session_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    exercise_log_id?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}