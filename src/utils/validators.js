export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

export function isPhone(value) {
  const cleaned = String(value || '').replace(/\s/g, '')
  return /^\+?\d{8,15}$/.test(cleaned)
}

export function required(value) {
  if (typeof value === 'number') return true
  return String(value || '').trim().length > 0
}

export function minLength(value, n) {
  return String(value || '').length >= n
}

export function validateVideoForm(values) {
  const errors = {}
  if (!required(values.title)) errors.title = 'Le titre est obligatoire.'
  if (!required(values.categoryId)) errors.categoryId = 'Choisissez une catégorie.'
  if (!required(values.author)) errors.author = "L'auteur est obligatoire."
  if (!required(values.durationSeconds) || Number(values.durationSeconds) <= 0) {
    errors.durationSeconds = 'Indiquez une durée valide.'
  }
  if (!values.videoUrl) errors.videoUrl = 'Ajoutez une vidéo ou une URL.'
  if (values.type === 'paid') {
    if (values.price === '' || Number(values.price) <= 0) {
      errors.price = 'Le prix est obligatoire pour une vidéo payante.'
    }
  }
  return errors
}

export function validateCategoryForm(values) {
  const errors = {}
  if (!required(values.name)) errors.name = 'Le nom est obligatoire.'
  if (!required(values.description)) errors.description = 'La description est obligatoire.'
  if (!required(values.image)) errors.image = 'Ajoutez une image.'
  return errors
}

export function validateRegister(values) {
  const errors = {}
  if (!required(values.lastName)) errors.lastName = 'Le nom est obligatoire.'
  if (!required(values.firstName)) errors.firstName = 'Le prénom est obligatoire.'
  if (!isEmail(values.email)) errors.email = 'Email invalide.'
  if (!isPhone(values.phone)) errors.phone = 'Téléphone invalide.'
  if (!minLength(values.password, 6)) errors.password = '6 caractères minimum.'
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas.'
  }
  return errors
}

export function validateLogin(values) {
  const errors = {}
  if (!isEmail(values.email)) errors.email = 'Email invalide.'
  if (!required(values.password)) errors.password = 'Mot de passe obligatoire.'
  return errors
}

export function validateProfile(values) {
  const errors = {}
  if (!required(values.lastName)) errors.lastName = 'Le nom est obligatoire.'
  if (!required(values.firstName)) errors.firstName = 'Le prénom est obligatoire.'
  if (!isEmail(values.email)) errors.email = 'Email invalide.'
  if (!isPhone(values.phone)) errors.phone = 'Téléphone invalide.'
  return errors
}
