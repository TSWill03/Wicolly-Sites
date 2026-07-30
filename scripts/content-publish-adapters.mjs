export const publishingAdapters = Object.freeze({
  instagram: { enabled: false, requiresHumanApproval: true },
  linkedin: { enabled: false, requiresHumanApproval: true },
  whatsapp: { enabled: false, requiresHumanApproval: true },
})

export function requireHumanApproval(options = {}) {
  if (options.approved !== true) throw new Error('Publicação bloqueada: aprovação humana explícita é obrigatória.')
  throw new Error('Publicação automática ainda não foi implementada; use apenas os rascunhos gerados.')
}
