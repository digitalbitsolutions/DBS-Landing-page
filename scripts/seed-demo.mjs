import fs from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

function readEnvFile(filePath) {
  const contents = fs.readFileSync(filePath, "utf8");

  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separatorIndex = line.indexOf("=");
        return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
      }),
  );
}

const envPath = path.resolve(".env.local");

if (!fs.existsSync(envPath)) {
  throw new Error("No existe .env.local. Crea el archivo antes de lanzar el seed.");
}

const env = readEnvFile(envPath);
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL ?? env.SUPABASE_URL;
const supabasePublishableKey =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Faltan variables publicas de Supabase. Configura NEXT_PUBLIC_SUPABASE_URL o SUPABASE_URL, y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

const supabase = createClient(supabaseUrl, supabasePublishableKey);

const demoLeads = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Sergio Molina",
    email: "sergio.molina@northfield.example",
    company: "Northfield Studio",
    message:
      "Necesitamos rehacer la landing, centralizar formularios y dejar una base limpia para automatizaciones comerciales.",
    source: "seed",
    status: "new",
    metadata: {
      budget: "5k-10k",
      project_type: "landing-cms",
    },
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Lucia Perez",
    email: "lucia.perez@atelier.example",
    company: null,
    message:
      "Quiero una web mas seria para captar clientes B2B y un panel pequeno para editar servicios y casos sin tocar codigo.",
    source: "seed",
    status: "contacted",
    metadata: {
      budget: "3k-5k",
      project_type: "rebrand",
    },
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Martin Salas",
    email: "martin.salas@opsboard.example",
    company: "Opsboard",
    message:
      "Buscamos un dashboard interno con autenticacion, gestion de proyectos y un flujo estable para leads entrantes. Tambien necesitamos que el contenido de la landing pueda evolucionar sin rehacer cada bloque en cada sprint.",
    source: "seed",
    status: "closed",
    metadata: {
      budget: "10k+",
      project_type: "internal-tool",
    },
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "Aitana Ruiz",
    email: "aitana.ruiz@solventa.example",
    company: "Solventa",
    message:
      "El objetivo es validar una nueva propuesta comercial con una landing premium, casos destacados y automatizaciones ligeras para no perder contexto de los contactos.",
    source: "seed",
    status: "new",
    metadata: {
      budget: "5k-10k",
      project_type: "growth-site",
    },
  },
];

async function main() {
  const [settingsResult, servicesResult, projectsResult, leadsResult] = await Promise.all([
    supabase.from("site_settings").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
  ]);

  const results = [
    ["site_settings", settingsResult],
    ["services", servicesResult],
    ["projects", projectsResult],
    ["leads", leadsResult],
  ];

  for (const [tableName, result] of results) {
    if (result.error) {
      throw new Error(`No se pudo leer ${tableName}: ${result.error.message}`);
    }
  }

  const summary = {
    site_settings: settingsResult.count ?? 0,
    services: servicesResult.count ?? 0,
    projects: projectsResult.count ?? 0,
    leads: leadsResult.count ?? 0,
  };

  console.log("Estado actual del seed:");
  console.table(summary);

  const { error: insertError } = await supabase.from("leads").insert(demoLeads);

  if (insertError) {
    if (insertError.message.toLowerCase().includes("duplicate key")) {
      console.log("Los leads demo ya estaban sembrados. No se han duplicado datos.");
      return;
    }

    throw new Error(`No se pudieron insertar los leads demo: ${insertError.message}`);
  }

  const { count: nextLeadCount, error: verifyError } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true });

  if (verifyError) {
    console.log(
      "Seed completado. Los leads demo se insertaron, pero la verificacion posterior esta bloqueada por las politicas RLS de lectura publica.",
    );
    return;
  }

  console.log(
    `Seed completado. Leads insertados: ${demoLeads.length}. Total visible con la clave actual: ${nextLeadCount ?? 0}.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
