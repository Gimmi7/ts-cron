import { WorkerPool } from "@gimmi7/ts-worker-pool";
import { parseCronExpression } from 'cron-schedule';

export class TsCron {
  _workerpool: WorkerPool

  constructor(workerpool?: WorkerPool) {
    if (workerpool) {
      this._workerpool = workerpool
    } else {
      this._workerpool = WorkerPool.defaultPool()
    }
  }

  schedule(cronExpression: string, moduleUrl: string, funcName: string, ...funcArgs: any) {
    const cron = parseCronExpression(cronExpression)
    const nextDate = cron.getNextDate()
    const now = new Date()
    const diff = nextDate.getTime() - now.getTime()

    setTimeout(() => {
      this._workerpool.run(moduleUrl, funcName, ...funcArgs).then(() => {
        this.schedule(cronExpression, moduleUrl, funcName, ...funcArgs)
      }
      )
    }, diff);
  }
}

