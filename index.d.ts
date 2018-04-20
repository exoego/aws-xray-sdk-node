import * as http from 'http';
import * as https from "https";
import * as AWS from 'aws-sdk/global';
import * as MySql from '@types/mysql';
import * as PostgreSQL from '@types/pg';

export class Segment {
    constructor(name: string, rootId?: string, parentId?: string);

    addAnnotation(key: string, value: boolean | string | number): void;

    addError(err: string | Error, remote?: boolean): void;

    addErrorFlag(): void;

    addFaultFlag(): void;

    addIncomingRequestData(data: middleware.IncomingRequestData): void;

    addMetadata(key: string, value: object | null, namespace?: string): void;

    addNewSubsegment(name: Subsegment): Subsegment;

    addPluginData(data: object): void;

    addSubsegment(subsegment: Segment): void;

    addThrottleFlag(): void;

    close(err: string | Error, remote?: boolean): void;

    decrementCounter(): void;

    flush(): void;

    format(): string;

    incrementCounter(additional?: number): void;

    init(name: string, rootId?: string, parentId?: string): void;

    isClosed(): boolean;

    removeSubsegment(subsegment: Subsegment): void;

    setSDKData(data: object): void;

    setServiceData(data: object): void;

    toString(): string;
}

export class Subsegment {
    constructor(name: string);

    addAnnotation(key: string, value: boolean | string | number): void;

    addAttribute(name: string, data: object): void;

    addError(err: string | Error, remote?: boolean): void;

    addErrorFlag(): void;

    addFaultFlag(): void;

    addMetadata(key: string, value: object | null, namespace?: string): void;

    addNewSubsegment(name: string): Subsegment;

    addPrecursorId(id: string): void;

    addRemoteRequestData(req: http.ClientRequest, req: http.IncomingMessage, downstreamXRayEnabled: boolean): void;

    addSqlData(sqlData: database.SqlData): void;

    addSubsegment(subsegment: Subsegment): void;

    addThrottleFlag(): void;

    close(err: string | Error, remote?: boolean): void;

    decrementCounter(): void;

    flush(): void;

    format(): string;

    incrementCounter(additional?: number): void;

    init(name: string): void;

    isClosed(): boolean;

    removeSubsegment(subsegment: Subsegment): void;

    streamSubsegments(): true | null;

    toJSON(): JSON;

    toString(): string;
}

export interface Plugin {
    getData(callback: Function);

    originName: string;
}

export const plugins: {
    EC2Plugin: Plugin;
    ECSPlugin: Plugin;
    ElasticBeanstalkPlugin: Plugin;
};

export type CallbackFunction<R> = (subsegment: Subsegment) => R;

export function appendAWSWhitelist(source: string | object): void;

export function captureAWS(awssdk: AWS): AWS;

export function captureAWSClient(awssdk: AWS.Service): AWS.Service;

export function captureAsyncFunc(name: string, fcn: CallbackFunction<any>, parent?: Segment | Subsegment): void;

export function captureCallbackFunc<R>(name: string, fcn: CallbackFunction<R>, parent?: Segment | Subsegment): CallbackFunction<R>;

export function captureFunc<R>(name: string, fcn: CallbackFunction<R>, parent?: Segment | Subsegment): CallbackFunction<R>;

export function captureHTTPs(module: http, downstreamXRayEnabled: boolean): http;
export function captureHTTPs(module: https, downstreamXRayEnabled: boolean): https;

export function captureHTTPsGlobal(module: http | https, downstreamXRayEnabled: boolean): void;

export function captureMySQL(mysql: MySql): MySql;

export function capturePostgres(pg: PostgreSQL): PostgreSQL;

export function capturePromise(): void;

export function config(plugins: Array[Plugin]): void;

export function enableAutomaticMode(): void;

export function enableManualMode(): void;

export function getLogger(): object;

export function getNamespace(): string;

export function getSegment(): Segment | Subsegment;

export function isAutomaticMode(): boolean;

export function resolveSegment(segment?: Segment | Subsegment): Segment | Subsegment | null;

export function setAWSWhitelist(source: string | object): void;

export function setContextMissingStrategy(strategy: string | Function): void;

export function setDaemonAddress(address: string): void;

export function setLogger(logObj: object): void;

export function setSegment(segment: Segment | Subsegment): void;

export function setStreamingThreshold(threshold: number): void;

export namespace SegmentUtils {
    const sdkData: {
        package: string;
        sdk: string;
        sdk_version: string;
    };
    const serviceData: {
        name: string;
        runtime: string;
        runtime_version: string;
        version: string;
    };
    const streamingThreshold: number;

    function getCurrentTime(): number;

    function getStreamingThreshold(): number;

    function setOrigin(origin: string): void;

    function setPluginData(pluginData: object): void;

    function setSDKData(sdkData: object): void;

    function setServiceData(serviceData: object): void;

    function setStreamingThreshold(threshold: number): void;
}

export namespace database {
    class SqlData {
        constructor(databaseVer: string, driveVer: string, user: string, queryType: string);

        init(databaseVer: string, driveVer: string, user: string, queryType: string);
    }
}

export namespace express {
    type CloseFunction = (err: any, req: any, res: any, next: boolean) => void;
    type OpenFunction = (req: any, res: any, next: boolean) => void;

    function closeSegment(): CloseFunction;

    function openSegment(defaultName: string): OpenFunction;
}

export namespace middleware {
    class IncomingRequestData {
        constructor(req: http.IncomingMessage);

        close(res: http.ServerResponse): void;

        init(req: http.IncomingMessage): void;
    }

    const defaultName: string;
    const dynamicNaming: boolean;
    const hostPattern: string | number;
    const sampler: SamplingRules;

    function enableDynamicNaming(hostPattern?: string): void;

    function processHeaders(req: http.IncomingMessage): object;


    function resolveName(hostHeader: string): string;

    function resolveSampling(amznTraceHeader: object, segment: Segment, req: http.ServerResponse): boolean;

    function setDefaultName(name: string): void;

    function setSamplingRules(source: string | object): void;

    export class SamplingRules {
        constructor(source?: string | object);

        init(source?: string | object): void;

        shouldSample(serviceName: string, httpMethod: string, urlPath: string): boolean;

        rules: Array<Rule>;
    }

    interface Rule {
        default: any;
        service_name: string;
        http_method: string;
        url_path: string;
        sampler: Sampler;
    }

    class Sampler {
        constructor(fixedTarget: number, fallbackRate: number)

        init(fixedTarget: number, fallbackRate: number): void;

        isSampled(): boolean;

        usedThisSecond: number;
    }
}

export namespace utils {
    function getCauseTypeFromHttpStatus(status: string): "error" | "fault" | undefined;


    function processTraceData(traceData: string): object;

    function wildcardMatch(pattern: string, text: string): boolean;

    namespace LambdaUtils {
        function populateTraceData(segment: Segment, xAmznTraceId: string): boolean;

        function validTraceData(xAmznTraceId: string): boolean;
    }
}
