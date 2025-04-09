import { CompanyContext } from '../types'

export class CompanyService {
  async getCompanyContext(accessToken: string): Promise<CompanyContext[]> {
    const response = await fetch(
      'https://api.repsly.com/AuthorizationService/UserCompanySession/companiesForWeb',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-Okta-User-Agent-Extended': 'okta-auth-js/7.12.1',
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to get company context: ${response.statusText}`)
    }

    const context = await response.json()
    return context
  }

  async setCompanySession(
    accessToken: string,
    companyId: string,
    fingerprint: string,
  ): Promise<void> {
    const response = await fetch(
      'https://api.repsly.com/AuthorizationService/UserCompanySession',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-Okta-User-Agent-Extended': 'okta-auth-js/7.12.1',
          Fingerprint: fingerprint,
          Origin: 'https://user.repsly.com',
          Referer: 'https://user.repsly.com/',
        },
        body: JSON.stringify({
          CompanyId: companyId,
          Timeoffset: new Date().getTimezoneOffset(),
          UserCulture: 'es-ES',
        }),
      },
    )

    if (!response.ok && response.status !== 204) {
      throw new Error(`Failed to set company session: ${response.statusText}`)
    }
  }
}
