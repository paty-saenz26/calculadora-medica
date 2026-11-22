// Acceso (F01): crear cuenta, iniciar sesión y recuperar contraseña, en una sola pantalla modal.
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  MENSAJE_RECUPERACION,
  validarConfirmacion,
  validarContrasenaActual,
  validarContrasenaNueva,
  validarCorreo,
} from '../domain/cuenta';
import { useAlmacen, useSesion } from '../state/instancias';
import { CampoTexto } from '../ui/componentes/CampoTexto';
import { Cristal } from '../ui/componentes/Cristal';
import { Fondo } from '../ui/componentes/Fondo';
import { LogoMS } from '../ui/componentes/LogoMS';
import { colores, fuentes } from '../ui/tema';

type Modo = 'iniciar' | 'registrar' | 'recuperar';

const TITULOS: Record<Modo, string> = {
  iniciar: 'Iniciar sesión',
  registrar: 'Crear cuenta',
  recuperar: 'Recuperar contraseña',
};

export default function Acceso() {
  const { modo: modoInicial } = useLocalSearchParams<{ modo?: Modo }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [modo, setModo] = useState<Modo>(modoInicial ?? 'iniciar');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [tocados, setTocados] = useState<Record<string, boolean>>({});
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string>();
  const [aviso, setAviso] = useState<string>();

  const errores = {
    correo: validarCorreo(correo),
    contrasena: modo === 'registrar' ? validarContrasenaNueva(contrasena) : validarContrasenaActual(contrasena),
    confirmacion: validarConfirmacion(contrasena, confirmacion),
  };
  const valido =
    !errores.correo && (modo === 'recuperar' || (!errores.contrasena && (modo !== 'registrar' || !errores.confirmacion)));
  const tocar = (campo: string) => setTocados((t) => ({ ...t, [campo]: true }));
  const mostrar = (campo: keyof typeof errores) => (tocados[campo] ? errores[campo] : undefined);

  const cambiarModo = (nuevo: Modo) => {
    setModo(nuevo);
    setTocados({});
    setErrorGeneral(undefined);
    setAviso(undefined);
  };

  // D8: si hay datos hechos como invitado, se pregunta una sola vez si pasan a la cuenta.
  const preguntarInvitado = (uid: string, terminar: () => void) => {
    const cantidad = useAlmacen.getState().cantidadInvitado();
    if (cantidad === 0) return terminar();
    Alert.alert(
      '¿Agregar tus datos a la cuenta?',
      `Tienes ${cantidad} ${cantidad === 1 ? 'dato' : 'datos'} (cálculos y favoritos) guardados en este teléfono sin cuenta. Si eliges No, se conservan aquí como invitado.`,
      [
        { text: 'No', style: 'cancel', onPress: terminar },
        {
          text: 'Sí, agregar',
          onPress: () => {
            useAlmacen.getState().reclamarInvitado(uid);
            terminar();
          },
        },
      ],
      { cancelable: false },
    );
  };

  const enviar = async () => {
    setTocados({ correo: true, contrasena: true, confirmacion: true });
    if (!valido || enviando) return;
    setEnviando(true);
    setErrorGeneral(undefined);
    const sesion = useSesion.getState();

    if (modo === 'recuperar') {
      const r = await sesion.recuperar(correo);
      setEnviando(false);
      if (r.ok) setAviso(MENSAJE_RECUPERACION);
      else setErrorGeneral(r.mensaje);
      return;
    }

    const r = modo === 'registrar' ? await sesion.registrar(correo, contrasena) : await sesion.entrar(correo, contrasena);
    setEnviando(false);
    if (!r.ok) {
      setErrorGeneral(r.mensaje);
      return;
    }
    const uid = useSesion.getState().usuario?.uid;
    const salir = () => router.back();
    if (uid) preguntarInvitado(uid, salir);
    else salir();
  };

  return (
    <Fondo>
      <KeyboardAvoidingView style={estilos.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[estilos.contenido, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={() => router.back()} style={estilos.cerrar}>
            <Cristal radio={24}>
              <View style={estilos.contenidoCerrar}>
                <Ionicons name="close" size={24} color={colores.textoPrincipal} />
              </View>
            </Cristal>
          </Pressable>

          <View style={estilos.marca}>
            <LogoMS diametro={96} verde />
            <Text style={estilos.nombreApp}>Calculadora Médica</Text>
            <Text style={estilos.lema}>Calculadoras y escalas clínicas</Text>
          </View>
          <Text style={estilos.titulo}>{TITULOS[modo]}</Text>
          {modo === 'recuperar' ? (
            <Text style={estilos.texto}>Te enviaremos un enlace para restablecerla.</Text>
          ) : null}

          <CampoTexto
            etiqueta="Correo"
            valor={correo}
            error={mostrar('correo')}
            onCambiar={setCorreo}
            onTerminar={() => tocar('correo')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {modo !== 'recuperar' ? (
            <CampoTexto
              etiqueta="Contraseña"
              valor={contrasena}
              error={mostrar('contrasena')}
              onCambiar={setContrasena}
              onTerminar={() => tocar('contrasena')}
              secureTextEntry
              autoCapitalize="none"
            />
          ) : null}
          {modo === 'registrar' ? (
            <CampoTexto
              etiqueta="Confirmar contraseña"
              valor={confirmacion}
              error={mostrar('confirmacion')}
              onCambiar={setConfirmacion}
              onTerminar={() => tocar('confirmacion')}
              secureTextEntry
              autoCapitalize="none"
            />
          ) : null}

          {errorGeneral ? <Text style={estilos.error}>{errorGeneral}</Text> : null}
          {aviso ? <Text style={estilos.texto}>{aviso}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={!valido || enviando}
            onPress={enviar}
            style={[estilos.primario, (!valido || enviando) && estilos.desactivado]}
          >
            <Text style={estilos.textoPrimario}>
              {enviando ? 'Un momento…' : modo === 'recuperar' ? 'Enviar enlace' : TITULOS[modo]}
            </Text>
          </Pressable>

          <View style={estilos.enlaces}>
            {modo === 'iniciar' ? (
              <>
                <Pressable onPress={() => cambiarModo('recuperar')}>
                  <Text style={estilos.enlace}>¿Olvidaste tu contraseña?</Text>
                </Pressable>
                <Pressable onPress={() => cambiarModo('registrar')}>
                  <Text style={estilos.enlace}>Crear cuenta</Text>
                </Pressable>
              </>
            ) : (
              <Pressable onPress={() => cambiarModo('iniciar')}>
                <Text style={estilos.enlace}>Ya tengo cuenta: iniciar sesión</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1 },
  contenido: { paddingHorizontal: 16, gap: 14 },
  cerrar: { width: 48, height: 48 },
  contenidoCerrar: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  marca: { alignItems: 'center', gap: 8, marginBottom: 4 },
  nombreApp: { fontFamily: fuentes.negrita, fontSize: 28, lineHeight: 34, color: colores.textoPrincipal, textAlign: 'center' },
  lema: { fontFamily: fuentes.normal, fontSize: 17, color: colores.textoSobreCristal, textAlign: 'center' },
  titulo: { fontFamily: fuentes.negrita, fontSize: 32, color: colores.textoPrincipal },
  texto: { fontFamily: fuentes.normal, fontSize: 18, lineHeight: 26, color: colores.textoPrincipal },
  error: { fontFamily: fuentes.media, fontSize: 17, color: colores.error },
  primario: { paddingVertical: 16, borderRadius: 999, backgroundColor: colores.primario, alignItems: 'center', marginTop: 6 },
  textoPrimario: { fontFamily: fuentes.seminegrita, fontSize: 18, color: colores.textoSobrePrimario },
  desactivado: { opacity: 0.45 },
  enlaces: { gap: 14, alignItems: 'center', marginTop: 6 },
  enlace: { fontFamily: fuentes.seminegrita, fontSize: 17, color: colores.primario },
});
