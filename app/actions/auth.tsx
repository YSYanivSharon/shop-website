export async function signup(formData: FormData) {
  'use server'

  // TODO: Implement validation
  const email = formData.get('email');
  const password = formData.get('password');

  // TODO: Hash the passwords

  // Insert the user into the database
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}
