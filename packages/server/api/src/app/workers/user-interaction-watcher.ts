import { apId, EngineResponseStatus, LATEST_JOB_DATA_SCHEMA_VERSION, UserInteractionJobDataWithoutWatchingInformation } from '@activepieces/shared'
import { FastifyBaseLogger } from 'fastify'
import { system } from '../helper/system/system'
import { AppSystemProp } from '../helper/system/system-props'
import { engineResponseWatcher } from './engine-response-watcher'
import { jobQueue, JobType } from './job-queue/job-queue'

export const userInteractionWatcher = {
    submitAndWaitForResponse: async <T>(request: UserInteractionJobDataWithoutWatchingInformation, log: FastifyBaseLogger, requestId?: string): Promise<T> => {
        const id = requestId ?? apId()
        await jobQueue(log).add({
            id,
            type: JobType.ONE_TIME,
            data: {
                ...request,
                requestId: id,
                webserverId: engineResponseWatcher(log).getServerId(),
                schemaVersion: LATEST_JOB_DATA_SCHEMA_VERSION,
            },
        })
        const timeoutMs = system.getNumberOrThrow(AppSystemProp.WEBHOOK_TIMEOUT_SECONDS) * 1000
        const timeoutResponse = { status: EngineResponseStatus.TIMEOUT, response: null } as unknown as T
        return engineResponseWatcher(log).oneTimeListener<T>(id, true, timeoutMs, timeoutResponse)
    },
}
