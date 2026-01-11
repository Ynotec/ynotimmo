import axios from 'axios'
import { LoggerService } from '../services/LoggerService'

export default class OdooApi {
    private static instance: OdooApi

    private baseUrl: string
    private dbName: string
    private dbUser: string
    private dbPassword: string

    private sessionId: string | null = null

    private get logger(): LoggerService {
        return LoggerService.getInstance()
    }
    private serviceName: string = 'OdooApi'

    private constructor() {
        if (
            !process.env.ODOO_BASE_URL ||
            !process.env.ODOO_DB_NAME ||
            !process.env.ODOO_DB_USER ||
            !process.env.ODOO_DB_PASSWORD
        ) {
            this.logger.error(
                this.serviceName,
                'constructor',
                'Odoo environment variables are not properly set.'
            )
            throw new Error('Odoo environment variables are not properly set.')
        }
        this.baseUrl = process.env.ODOO_BASE_URL
        this.dbName = process.env.ODOO_DB_NAME
        this.dbUser = process.env.ODOO_DB_USER
        this.dbPassword = process.env.ODOO_DB_PASSWORD
    }

    public static getInstance(): OdooApi {
        if (!OdooApi.instance) {
            OdooApi.instance = new OdooApi()
        }
        return OdooApi.instance
    }

    public async authenticate(): Promise<void> {
        const methodName = 'authenticate'
        try {
            this.logger.debug(this.serviceName, methodName, 'START')

            const response = await axios.post(
                `${this.baseUrl}/web/session/authenticate`,
                {
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        db: this.dbName,
                        login: this.dbUser,
                        password: this.dbPassword,
                    },
                }
            )

            const cookies: string[] | undefined = response.headers['set-cookie']

            if (!cookies || !Array.isArray(cookies) || cookies.length === 0) {
                this.logger.error(
                    this.serviceName,
                    methodName,
                    'Authentication failed: No cookies returned from server.'
                )
                throw new Error(
                    'Authentication failed: No cookies returned from server.'
                )
            }

            const sessionCookieLine = cookies.find((c) =>
                c.startsWith('session_id=')
            )

            if (!sessionCookieLine) {
                this.logger.error(
                    this.serviceName,
                    methodName,
                    "Authentication failed: 'session_id' cookie is missing."
                )
                throw new Error(
                    "Authentication failed: 'session_id' cookie is missing."
                )
            }

            const match = sessionCookieLine.match(/session_id=([^;]+)/)

            if (!match || !match[1]) {
                this.logger.error(
                    this.serviceName,
                    methodName,
                    'Authentication failed: Could not parse session_id value.'
                )
                throw new Error(
                    'Authentication failed: Could not parse session_id value.'
                )
            }

            this.sessionId = match[1]

            this.logger.info(
                this.serviceName,
                methodName,
                'Authentication successful.'
            )
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(
                    this.serviceName,
                    methodName,
                    `Authentication process failed: ${error.message}`
                )
                throw new Error(
                    `Authentication process failed: ${error.message}`
                )
            }
            this.logger.error(
                this.serviceName,
                methodName,
                'Authentication process failed: Unknown error'
            )
            throw new Error('Authentication process failed: Unknown error')
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }

    public async call(
        model: string,
        method: string,
        args: any[] = [],
        kwargs: Record<string, any> = {}
    ): Promise<any> {
        if (!this.sessionId) {
            await this.authenticate()
        }
        const methodName = 'call'
        try {
            this.logger.debug(this.serviceName, methodName, 'START')
            const response = await axios.post(
                `${this.baseUrl}/web/dataset/call_kw`,
                {
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        model: model,
                        method: method,
                        args: args,
                        kwargs: kwargs,
                    },
                },
                {
                    headers: {
                        Cookie: `session_id=${this.sessionId}`,
                    },
                }
            )
            this.logger.info(
                this.serviceName,
                methodName,
                'Odoo API call successful.'
            )
            return response.data.result
        } catch (error) {
            this.logger.error(
                this.serviceName,
                methodName,
                `Odoo API call failed: ${error}`
            )
            throw new Error(`Odoo API call failed: ${error}`)
        } finally {
            this.logger.debug(this.serviceName, methodName, 'END')
        }
    }
}
