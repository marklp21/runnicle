import { supabase } from '../lib/supabase';
import { type EventItem, type DbEvent, type DbRegistration } from '../types';

export function dbEventToEventItem(dbEvent: DbEvent): EventItem {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    badge: (dbEvent.badge as any) || 'OPEN',
    distances: dbEvent.distances || [],
    date: new Date(dbEvent.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    deadline: new Date(dbEvent.deadline || dbEvent.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    location: dbEvent.location,
    description: dbEvent.description || '',
    highlights: dbEvent.highlights || [],
    details: {
      time: dbEvent.time || '06:00 AM',
      fee: dbEvent.fee || '500',
      route: dbEvent.route || dbEvent.location,
      routes: dbEvent.routes || {},
      slotsLeft: dbEvent.slots_left || 500,
      schedule: dbEvent.schedule || [],
      perks: dbEvent.perks || []
    },
    iconType: (dbEvent.icon_type as any) || 'compass',
    image: dbEvent.image || 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
    kitImage: dbEvent.kit_image || undefined,
    routeMapImage: dbEvent.route_map_image || undefined,
    galleryImages: dbEvent.gallery_images || [],
    inclusions: dbEvent.inclusions || [],
    jerseyFee: dbEvent.jersey_fee || undefined,
    earlyBirdDeadline: dbEvent.early_bird_deadline ? new Date(dbEvent.early_bird_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
    earlyBirdDiscountPercent: dbEvent.early_bird_discount_percent || undefined,
    distanceFees: dbEvent.distance_fees || {}
  };
}

export function eventItemToDb(event: EventItem): any {
  const dbRecord: any = {
    title: event.title,
    starts_at: new Date(event.date).toISOString(),
    location: event.location,
    badge: event.badge || 'OPEN',
    distances: event.distances || [],
    deadline: new Date(event.deadline || event.date).toISOString(),
    description: event.description || '',
    highlights: event.highlights || [],
    time: event.details?.time || '06:00 AM',
    fee: event.details?.fee || '500',
    route: event.details?.route || event.location,
    routes: event.details?.routes || {},
    slots_left: event.details?.slotsLeft || 500,
    schedule: event.details?.schedule || [],
    perks: event.details?.perks || [],
    icon_type: event.iconType || 'compass',
    image: event.image || '',
    kit_image: event.kitImage || null,
    route_map_image: event.routeMapImage || null,
    gallery_images: event.galleryImages || [],
    inclusions: event.inclusions || [],
    jersey_fee: event.jerseyFee || null,
    early_bird_deadline: event.earlyBirdDeadline ? new Date(event.earlyBirdDeadline).toISOString() : null,
    early_bird_discount_percent: event.earlyBirdDiscountPercent || null,
    distance_fees: event.distanceFees || {}
  };

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (event.id && uuidRegex.test(event.id)) {
    dbRecord.id = event.id;
  }

  return dbRecord;
}

export function dbRegistrationToFrontend(dbReg: DbRegistration): any {
  let extra: any = {};
  try {
    if (dbReg.ticket_code) {
      extra = JSON.parse(dbReg.ticket_code);
    }
  } catch (e) {
    // ignore
  }

  let distance = "10K";
  if (dbReg.distance_meters) {
    if (dbReg.distance_meters === 42195) {
      distance = "MARATHON";
    } else {
      distance = `${dbReg.distance_meters / 1000}K`;
    }
  }

  return {
    id: dbReg.id,
    eventId: dbReg.event_id,
    firstName: dbReg.first_name,
    lastName: dbReg.last_name,
    distance,
    size: dbReg.size,
    registeredBib: dbReg.registered_bib,
    status: dbReg.status,
    registrationDate: dbReg.registration_date || dbReg.created_at,
    email: dbReg.email || extra.email || 'reg@gmail.com',
    phone: dbReg.phone || extra.phone || '09000000000',
    gender: dbReg.gender || extra.gender || extra.sex || 'Male',
    sex: dbReg.gender || extra.gender || extra.sex || 'Male',
    paymentMethod: dbReg.payment_method || extra.paymentMethod || 'GCash',
    referenceNumber: dbReg.reference_number || extra.referenceNumber || '0912',
    emergencyContact: dbReg.emergency_contact || extra.emergencyContact || extra.emergencyName || 'Maria Dela Cruz',
    emergencyPhone: dbReg.emergency_phone || extra.emergencyPhone || '09187654321',
    totalAmount: dbReg.total_amount || extra.totalAmount || 500,
    paymentProof: dbReg.payment_proof || extra.paymentProof || null
  };
}

export function frontendRegistrationToDb(reg: any, eventsList: EventItem[]): any {
  const matchedEvent = eventsList.find(e => e.title.toLowerCase() === (reg.eventTitle || '').toLowerCase());
  const eventId = matchedEvent ? matchedEvent.id : (eventsList[0] ? eventsList[0].id : null);

  let distanceMeters = 10000;
  const distStr = (reg.distance || '').toUpperCase();
  if (distStr === 'MARATHON') {
    distanceMeters = 42195;
  } else {
    const num = parseInt(distStr.replace('K', ''));
    if (!isNaN(num)) {
      distanceMeters = num * 1000;
    }
  }

  const extraFields = {
    email: reg.email,
    phone: reg.phone,
    gender: reg.gender || reg.sex,
    paymentMethod: reg.paymentMethod,
    referenceNumber: reg.referenceNumber,
    emergencyContact: reg.emergencyContact || reg.emergencyName,
    emergencyPhone: reg.emergencyPhone,
    totalAmount: reg.totalAmount,
    paymentProof: reg.paymentProof
  };

  const ticketCode = JSON.stringify(extraFields);
  const ticketCodeHash = reg.ticketCodeHash || `hash-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    event_id: eventId,
    first_name: reg.firstName,
    last_name: reg.lastName,
    distance_meters: distanceMeters,
    size: reg.size || reg.singletSize || 'M',
    registered_bib: reg.registeredBib || null,
    status: reg.status || 'Pending',
    registration_date: reg.registrationDate || new Date().toISOString(),
    ticket_code: ticketCode,
    ticket_code_hash: ticketCodeHash,
    ticket_expires_at: reg.ticketExpiresAt || null,
    
    // Fallbacks for direct schema columns if they exist
    email: reg.email,
    phone: reg.phone,
    gender: reg.gender || reg.sex,
    payment_method: reg.paymentMethod,
    reference_number: reg.referenceNumber,
    emergency_contact: reg.emergencyContact || reg.emergencyName,
    emergency_phone: reg.emergencyPhone,
    total_amount: reg.totalAmount,
    payment_proof: reg.paymentProof || null
  };
}

export const supabaseService = {
  async fetchEvents(): Promise<EventItem[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('starts_at', { ascending: true });

    if (error) throw error;
    return (data || []).map(dbEventToEventItem);
  },

  async seedEvents(eventsList: EventItem[]): Promise<EventItem[]> {
    const dbEvents = eventsList.map(eventItemToDb);

    const { data, error } = await supabase
      .from('events')
      .insert(dbEvents)
      .select();

    if (error) throw error;
    return (data || []).map(dbEventToEventItem);
  },

  async fetchRegistrations(eventsList: EventItem[]): Promise<any[]> {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(dbReg => {
      const mapped = dbRegistrationToFrontend(dbReg);
      const event = eventsList.find(e => e.id === mapped.eventId);
      mapped.eventTitle = event ? event.title : 'MegaWorld Fun Run';
      return mapped;
    });
  },

  async fetchRegistrationById(id: string, eventsList: EventItem[]): Promise<any | null> {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const mapped = dbRegistrationToFrontend(data);
    const event = eventsList.find(e => e.id === mapped.eventId);
    mapped.eventTitle = event ? event.title : 'MegaWorld Fun Run';
    return mapped;
  },

  async insertEvent(event: EventItem): Promise<EventItem> {
    const dbRecord = eventItemToDb(event);
    const { data, error } = await supabase
      .from('events')
      .insert(dbRecord)
      .select()
      .single();

    if (error) throw error;
    return dbEventToEventItem(data);
  },

  async updateEvent(event: EventItem): Promise<void> {
    const dbRecord = eventItemToDb(event);
    const { error } = await supabase
      .from('events')
      .update(dbRecord)
      .eq('id', event.id);

    if (error) throw error;
  },

  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  },

  async insertRegistration(registration: any, eventsList: EventItem[]): Promise<any> {
    const dbRecord = frontendRegistrationToDb(registration, eventsList);
    if (registration.id && registration.id.startsWith('reg-')) {
      delete dbRecord.id;
    } else if (registration.id) {
      dbRecord.id = registration.id;
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert(dbRecord)
      .select()
      .single();

    if (error) throw error;

    const mapped = dbRegistrationToFrontend(data);
    const event = eventsList.find(e => e.id === mapped.eventId);
    mapped.eventTitle = event ? event.title : 'MegaWorld Fun Run';
    return mapped;
  },

  async updateRegistration(registration: any, eventsList: EventItem[]): Promise<void> {
    const dbRecord = frontendRegistrationToDb(registration, eventsList);
    const { error } = await supabase
      .from('registrations')
      .update(dbRecord)
      .eq('id', registration.id);

    if (error) throw error;
  },

  async deleteRegistration(registrationId: string): Promise<void> {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', registrationId);

    if (error) throw error;
  }
};
