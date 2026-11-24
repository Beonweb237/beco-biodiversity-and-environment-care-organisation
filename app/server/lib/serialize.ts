// ============================================================
// Mappage des lignes Supabase (snake_case) vers les DTO (camelCase)
// ============================================================

type Row = Record<string, any>;

export function mapProject(r: Row) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    tag: r.tag,
    date: r.date,
    description: r.description,
    image: r.image,
    details: r.details,
    funder: r.funder,
    category: r.category,
    url: r.url,
    isPublished: r.is_published,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function mapNews(r: Row) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    tag: r.tag,
    date: r.date,
    image: r.image,
    category: r.category,
    isPublished: r.is_published,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function mapTeamMember(r: Row) {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    status: r.status,
    description: r.description,
    image: r.image,
    linkedin: r.linkedin,
    email: r.email,
    order: r.sort_order,
    isPublished: r.is_published,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function mapFocusArea(r: Row) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    image: r.image,
    order: r.sort_order,
    isPublished: r.is_published,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function mapPartner(r: Row) {
  return {
    id: r.id,
    name: r.name,
    abbr: r.abbr,
    logo: r.logo,
    order: r.sort_order,
    isPublished: r.is_published,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function mapContactMessage(r: Row) {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    email: r.email,
    subject: r.subject,
    type: r.type,
    message: r.message,
    isRead: r.is_read,
    createdAt: r.created_at,
  };
}

export function mapVolunteer(r: Row) {
  return {
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    interest: r.interest,
    motivation: r.motivation,
    isRead: r.is_read,
    createdAt: r.created_at,
  };
}

export function mapActivityLog(r: Row) {
  return {
    id: r.id,
    adminUserId: r.admin_user_id,
    adminName: r.admin_name,
    action: r.action,
    entity: r.entity,
    entityId: r.entity_id,
    details: r.details,
    createdAt: r.created_at,
  };
}

export function mapAdminUser(r: Row) {
  return {
    id: r.id,
    username: r.username,
    name: r.name,
    email: r.email,
    role: r.role,
    isActive: r.is_active,
    createdAt: r.created_at,
  };
}

export function mapSetting(r: Row) {
  return {
    key: r.key,
    value: r.value,
    updatedAt: r.updated_at,
  };
}
