import * as t from "io-ts";
import * as r from "italia-ts-commons/lib/requests";
import { ServerInfo } from "./ServerInfo";
/****************************************************************
 * getServerInfo
 */
export declare type GetServerInfoT = r.IGetApiRequestType<{}, never, never, r.IResponseType<200, ServerInfo, never>>;
export declare const getServerInfoDefaultResponses: {
    200: t.ExactC<t.IntersectionC<[t.TypeC<{}>, t.PartialC<{
        version: t.StringC;
    }>]>>;
};
export declare type GetServerInfoResponsesT<A0 = ServerInfo, C0 = ServerInfo> = {
    200: t.Type<A0, C0>;
};
export declare function getServerInfoDecoder<A0 = ServerInfo, C0 = ServerInfo>(overrideTypes?: Partial<GetServerInfoResponsesT<A0, C0>> | t.Type<A0, C0> | undefined): r.ResponseDecoder<r.IResponseType<200, A0, never>>;
export declare const getServerInfoDefaultDecoder: () => r.ResponseDecoder<r.IResponseType<200, {} & {
    version?: string | undefined;
}, never>>;
