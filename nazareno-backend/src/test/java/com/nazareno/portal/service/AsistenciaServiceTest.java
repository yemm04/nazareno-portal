package com.nazareno.portal.service;

import com.nazareno.portal.model.Asistencia;
import com.nazareno.portal.repository.AsistenciaRepository;
import com.nazareno.portal.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AsistenciaServiceTest {

    private static final ZoneId ZONA_PERU = ZoneId.of("America/Lima");

    @Test
    void marcaSalidaDespuesDeCuatroHorasYDejaPendientesLasVigentes() {
        AsistenciaRepository asistenciaRepository = mock(AsistenciaRepository.class);
        UsuarioRepository usuarioRepository = mock(UsuarioRepository.class);
        AsistenciaService service = new AsistenciaService(asistenciaRepository, usuarioRepository);

        Asistencia vencida = new Asistencia();
        vencida.setFecha(LocalDate.now(ZONA_PERU).minusDays(1));
        vencida.setHoraEntrada(LocalTime.of(9, 30));

        Asistencia vigente = new Asistencia();
        LocalDateTime entradaVigente = LocalDateTime.now(ZONA_PERU).minusHours(3);
        vigente.setFecha(entradaVigente.toLocalDate());
        vigente.setHoraEntrada(entradaVigente.toLocalTime());

        when(asistenciaRepository.findAllByHoraSalidaIsNull()).thenReturn(List.of(vencida, vigente));

        service.marcarSalidasVencidas();

        assertEquals(LocalTime.of(13, 30), vencida.getHoraSalida());
        assertNull(vigente.getHoraSalida());
        verify(asistenciaRepository).save(vencida);
    }

    @Test
    void noPermiteMarcarSalidaAntesDeCuatroHoras() {
        AsistenciaRepository asistenciaRepository = mock(AsistenciaRepository.class);
        UsuarioRepository usuarioRepository = mock(UsuarioRepository.class);
        AsistenciaService service = new AsistenciaService(asistenciaRepository, usuarioRepository);

        Asistencia vigente = new Asistencia();
        LocalDateTime entrada = LocalDateTime.now(ZONA_PERU).minusHours(3);
        vigente.setFecha(entrada.toLocalDate());
        vigente.setHoraEntrada(entrada.toLocalTime());
        when(asistenciaRepository.findByUsuarioIdAndFecha(1L, LocalDate.now(ZONA_PERU)))
                .thenReturn(Optional.of(vigente));

        assertThrows(IllegalStateException.class, () -> service.marcarSalida(1L));
    }
}
