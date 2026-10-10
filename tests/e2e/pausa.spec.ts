import { expect, test, type Page } from "@playwright/test";

const SITUACIONES = [
  { nombre: "trabajo en grupo", texto: "Mis compañeros no cumplieron su parte del trabajo." },
  { nombre: "discusión en casa", texto: "Tuve una discusión en casa." },
  { nombre: "tareas acumuladas", texto: "Se me acumularon varias tareas." },
];

async function llenarPantallaSentir(
  page: Page,
  { emocion, intensidad, situacion, minutos }: { emocion: string; intensidad: string; situacion: string; minutos: string },
) {
  await page.getByRole("radio", { name: emocion, exact: true }).click();
  await page.getByRole("radiogroup", { name: "¿Qué tan intensa es?" }).getByRole("radio", { name: intensidad, exact: true }).click();
  await page.getByRole("radio", { name: situacion, exact: true }).click();
  await page.getByRole("radiogroup", { name: "¿Cuánto tiempo quieres pausar?" }).getByRole("radio", { name: minutos, exact: true }).click();
}

async function encontrarPausa(page: Page) {
  await page.getByRole("button", { name: "Encontrar mi pausa" }).click();
  await expect(page.getByRole("heading", { name: "Mi pausa", exact: true })).toBeVisible();
}

test.describe("recorrido de pausa", () => {
  for (const situacion of SITUACIONES) {
    test(`completa el flujo para ${situacion.nombre}`, async ({ page }) => {
      await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
      await expect(page.getByRole("heading", { name: "Cómo me siento", exact: true })).toBeVisible();

      await llenarPantallaSentir(page, {
        emocion: "Estrés",
        intensidad: "7",
        situacion: situacion.texto,
        minutos: "5 min",
      });
      await encontrarPausa(page);

      await expect(page.getByText(/Pausa adaptada con IA|Modo demo: actividad sin adaptación por IA/)).toBeVisible();
      await expect(page.getByRole("timer", { name: "Tiempo restante" })).toHaveText("05:00");
      await expect(page.getByRole("region", { name: "Indicación actual" })).toContainText(/\S/);

      await page.getByRole("button", { name: "Terminé mi pausa" }).click();
      await expect(page.getByRole("heading", { name: "Mi siguiente paso", exact: true })).toBeVisible();

      await page.locator("section").filter({ hasText: "¿Qué tan fuerte sientes esa emoción ahora?" }).getByRole("radio", { name: "6", exact: true }).click();
      await page.getByRole("radio", { name: "Decir cómo me siento y qué necesito" }).click();
      await page.getByRole("button", { name: "Ver mi resumen" }).click();

      const resumen = page.getByRole("region", { name: "Tu siguiente paso" });
      await expect(resumen).toContainText(situacion.texto);
      await expect(resumen).toContainText("Decir cómo me siento y qué necesito");
      await expect(resumen).toContainText("Intensidad inicial");
      await expect(resumen).toContainText("7/10");
      await expect(resumen).toContainText("6/10");

      await page.getByRole("button", { name: "Iniciar otro recorrido" }).click();
      await expect(page.getByRole("heading", { name: "Cómo me siento", exact: true })).toBeVisible();
      await expect(page.getByRole("radio", { name: "Estrés", exact: true })).toHaveAttribute("aria-checked", "false");
    });
  }

  test("valida todos los campos de la primera pantalla y conserva lo elegido", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    await page.getByRole("radio", { name: "Ansiedad", exact: true }).click();
    await page.getByRole("button", { name: "Encontrar mi pausa" }).click();

    await expect(page.getByText("Elige cómo te sientes.")).toHaveCount(0);
    await expect(page.getByText("Elige qué tan intensa es la emoción.")).toBeVisible();
    await expect(page.getByText("Elige lo que ocurrió.")).toBeVisible();
    await expect(page.getByText("Elige cuánto tiempo quieres pausar.")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Ansiedad", exact: true })).toHaveAttribute("aria-checked", "true");
  });

  test("exige intensidad y paso en la tercera pantalla", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    await llenarPantallaSentir(page, { emocion: "Tristeza", intensidad: "4", situacion: SITUACIONES[2].texto, minutos: "2 min" });
    await encontrarPausa(page);
    await page.getByRole("button", { name: "Terminé mi pausa" }).click();

    await page.getByRole("button", { name: "Ver mi resumen" }).click();
    await expect(page.getByText("Elige qué tan fuerte la sientes ahora.")).toBeVisible();
    await expect(page.getByText("Elige el pequeño paso que quieres dar.")).toBeVisible();
    await expect(page.getByRole("region", { name: "Tu siguiente paso" })).toHaveCount(0);
  });

  test("temporizador: detener, reanudar y fin del tiempo", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    await llenarPantallaSentir(page, { emocion: "Ansiedad", intensidad: "8", situacion: SITUACIONES[1].texto, minutos: "2 min" });
    await encontrarPausa(page);

    const reloj = page.getByRole("timer", { name: "Tiempo restante" });
    await expect(reloj).toHaveText("02:00");

    await page.clock.runFor(10_000);
    await expect(reloj).toHaveText("01:50");

    await page.getByRole("button", { name: "Pausar" }).click();
    await page.clock.runFor(30_000);
    await expect(reloj).toHaveText("01:50");

    await page.getByRole("button", { name: "Continuar", exact: true }).click();
    await page.clock.runFor(20_000);
    await expect(reloj).toHaveText("01:30");

    await page.clock.runFor(90_000);
    await expect(page.getByText("Tu tiempo terminó")).toBeVisible();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("heading", { name: "Mi siguiente paso", exact: true })).toBeVisible();
  });

  test("muestra apoyo profesional desde cualquier pantalla", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    const abrir = page.getByRole("button", { name: "Quiero hablar con alguien" });
    const dialogo = page.getByRole("dialog", { name: "Hablar con alguien" });

    await abrir.click();
    await expect(dialogo).toBeVisible();
    await expect(dialogo).toContainText("Línea 113, opción 5");
    await expect(dialogo.getByRole("link", { name: "Ir a Bienestar Universitario" })).toHaveAttribute(
      "href",
      /ucv\.edu\.pe/,
    );
    await page.keyboard.press("Escape");
    await expect(dialogo).toBeHidden();

    await llenarPantallaSentir(page, { emocion: "Estrés", intensidad: "5", situacion: SITUACIONES[0].texto, minutos: "2 min" });
    await encontrarPausa(page);
    await abrir.click();
    await expect(dialogo).toBeVisible();
    await page.getByRole("button", { name: "Cerrar" }).click();

    await page.getByRole("button", { name: "Terminé mi pausa" }).click();
    await abrir.click();
    await expect(dialogo).toBeVisible();
  });

  test("el aviso de no reemplazar la atención profesional aparece en todas las pantallas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    const aviso = page.getByText("Esta herramienta no reemplaza la atención profesional.", { exact: true });
    await expect(aviso).toBeVisible();

    await llenarPantallaSentir(page, { emocion: "Ansiedad", intensidad: "3", situacion: SITUACIONES[2].texto, minutos: "2 min" });
    await encontrarPausa(page);
    await expect(aviso).toBeVisible();

    await page.getByRole("button", { name: "Terminé mi pausa" }).click();
    await expect(aviso).toBeVisible();
  });

  test("ofrece las cinco situaciones y permite continuar con Otros sin descripción", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    const grupo = page.getByRole("radiogroup", { name: "¿Qué ocurrió?" });
    await expect(grupo.getByRole("radio")).toHaveCount(5);
    await expect(page.getByLabel("Si quieres, cuéntanos un poco más")).toHaveCount(0);

    await grupo.getByRole("radio", { name: "Otros.", exact: true }).click();
    await expect(page.getByLabel("Si quieres, cuéntanos un poco más")).toBeVisible();
    await expect(
      page.getByText("Para esta demostración, usa una situación ficticia y evita datos personales."),
    ).toBeVisible();

    await llenarPantallaSentir(page, { emocion: "Tristeza", intensidad: "4", situacion: "Otros.", minutos: "2 min" });
    await encontrarPausa(page);
    await page.getByRole("button", { name: "Terminé mi pausa" }).click();
    await page.locator("section").filter({ hasText: "¿Qué tan fuerte sientes esa emoción ahora?" }).getByRole("radio", { name: "3", exact: true }).click();
    await page.getByRole("radio", { name: "Hablar con alguien de confianza" }).click();
    await page.getByRole("button", { name: "Ver mi resumen" }).click();
    await expect(page.getByRole("region", { name: "Tu siguiente paso" })).toContainText("Otros.");
  });

  test("la descripción de Otros tiene límite de 200 caracteres y aparece en el resumen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    await page.getByRole("radio", { name: "Ansiedad", exact: true }).click();
    await page.getByRole("radiogroup", { name: "¿Qué tan intensa es?" }).getByRole("radio", { name: "6", exact: true }).click();
    await page.getByRole("radio", { name: "Otros.", exact: true }).click();
    await page.getByRole("radiogroup", { name: "¿Cuánto tiempo quieres pausar?" }).getByRole("radio", { name: "2 min" }).click();

    const campo = page.getByLabel("Si quieres, cuéntanos un poco más");
    await campo.fill("a".repeat(250));
    await expect(campo).toHaveValue("a".repeat(200));
    await expect(page.getByText("200/200")).toBeVisible();

    await campo.fill("Tuve un malentendido con una profesora.");
    await encontrarPausa(page);
    await page.getByRole("button", { name: "Terminé mi pausa" }).click();
    await page.locator("section").filter({ hasText: "¿Qué tan fuerte sientes esa emoción ahora?" }).getByRole("radio", { name: "5", exact: true }).click();
    await page.getByRole("radio", { name: "Darme un poco más de tiempo" }).click();
    await page.getByRole("button", { name: "Ver mi resumen" }).click();
    await expect(page.getByRole("region", { name: "Tu siguiente paso" })).toContainText("Tuve un malentendido con una profesora.");
  });

  test("completa el recorrido eligiendo Enojo y muestra la frase de esa emoción", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    await expect(page.getByRole("radiogroup", { name: "¿Qué estás sintiendo?" }).getByRole("radio")).toHaveCount(4);
    await llenarPantallaSentir(page, { emocion: "Enojo", intensidad: "6", situacion: SITUACIONES[0].texto, minutos: "5 min" });
    await encontrarPausa(page);
    await page.getByRole("button", { name: "Terminé mi pausa" }).click();
    await page.locator("section").filter({ hasText: "¿Qué tan fuerte sientes esa emoción ahora?" }).getByRole("radio", { name: "2", exact: true }).click();
    await page.getByRole("radio", { name: "Darme un poco más de tiempo" }).click();
    await page.getByRole("button", { name: "Ver mi resumen" }).click();

    const resumen = page.getByRole("region", { name: "Tu siguiente paso" });
    await expect(resumen).toContainText("Enojo");
    await expect(resumen).toContainText("6/10");
    await expect(resumen).toContainText("2/10");
    const frases = [
      "Puedes darte un momento antes de responder",
      "Tus palabras importan",
      "Hacer una pausa también es cuidarte",
      "No tienes que resolverlo todo ahora",
      "Mereces expresar lo que te pasa",
    ];
    const texto = await page.locator("p.text-xl").innerText();
    expect(frases.some((f) => texto.includes(f))).toBe(true);
  });

  test("muestra la bienvenida antes de elegir la emoción", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Este momento es para ti" })).toBeVisible();
    await expect(page.getByText("Vamos a tu ritmo.")).toBeVisible();
    await expect(page.getByRole("radio")).toHaveCount(0);
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    await expect(page.getByRole("heading", { name: "Cómo me siento", exact: true })).toBeVisible();
    await expect(page.getByRole("radiogroup", { name: "¿Qué estás sintiendo?" }).getByRole("radio")).toHaveCount(4);
  });

  test("navega las indicaciones sin reiniciar el temporizador", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    await llenarPantallaSentir(page, { emocion: "Ansiedad", intensidad: "5", situacion: SITUACIONES[0].texto, minutos: "5 min" });
    await encontrarPausa(page);

    await expect(page.getByText(/^Indicación 1 de \d+$/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Anterior" })).toBeDisabled();

    await page.clock.runFor(30_000);
    const reloj = page.getByRole("timer", { name: "Tiempo restante" });
    await expect(reloj).toHaveText("04:30");

    await page.getByRole("button", { name: "Siguiente" }).click();
    await expect(page.getByText(/^Indicación 2 de \d+$/)).toBeVisible();
    await expect(reloj).toHaveText("04:30");
    await page.clock.runFor(10_000);
    await expect(reloj).toHaveText("04:20");

    await page.getByRole("button", { name: "Anterior" }).click();
    await expect(page.getByText(/^Indicación 1 de \d+$/)).toBeVisible();
    await expect(reloj).toHaveText("04:20");
  });

  test("muestra enlaces oficiales de la UCV en la primera pantalla", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Comenzar mi pausa" }).click();
    const pie = page.getByRole("navigation", { name: "Enlaces de la UCV" });
    await expect(pie.getByRole("link", { name: "ucv.edu.pe" })).toHaveAttribute("href", "https://www.ucv.edu.pe/");
    await expect(pie.getByRole("link", { name: "Facebook" })).toHaveAttribute("href", "https://web.facebook.com/UCV.Peru");
  });
});
