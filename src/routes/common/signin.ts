import { validateAdmin } from 'db/actions'
import { User } from 'db/types'
import { route, AppData } from 'router'
import { decode } from 'routes/parser'
import { Record, String } from 'runtypes'

const adminDecoder = Record({
  usernameOrEmail: String,
  password: String,
})

export const handler = route<User>((req, session) =>
  decode(adminDecoder, req.body, 'Invalid request body').map(
    ({ usernameOrEmail, password }) =>
      validateAdmin(usernameOrEmail, password)
        .andThen(session.createSession)
        .map(({ sessionToken, admin }) => AppData.init(admin, sessionToken))
  )
)
