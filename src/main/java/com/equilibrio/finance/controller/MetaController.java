package com.equilibrio.finance.controller;

import com.equilibrio.finance.model.Meta;
import com.equilibrio.finance.model.User;
import com.equilibrio.finance.repository.MetaRepository;
import com.equilibrio.finance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metas")
@RequiredArgsConstructor
public class MetaController {

    private final MetaRepository metaRepository;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Meta>> listarMetas(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        List<Meta> metas = metaRepository.findByUserIdOrderByDataAlvoAsc(user.getId());
        return ResponseEntity.ok(metas);
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<Meta>> listarMetasAtivas(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        List<Meta> metas = metaRepository.findByUserIdAndStatus(user.getId(), "EM_PROGRESSO");
        return ResponseEntity.ok(metas);
    }

    @PostMapping
    public ResponseEntity<Meta> criarMeta(@RequestBody Meta meta, Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        meta.setUser(user);
        if (meta.getStatus() == null) {
            meta.setStatus("EM_PROGRESSO");
        }
        if (meta.getValorAtual() == null) {
            meta.setValorAtual(0.0);
        }
        Meta salva = metaRepository.save(meta);
        return ResponseEntity.ok(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Meta> atualizarMeta(
            @PathVariable Long id,
            @RequestBody Meta meta,
            Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }

        Meta existente = metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada"));

        // Verificar se a meta pertence ao usuário
        if (!existente.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        existente.setTitulo(meta.getTitulo());
        existente.setValorAlvo(meta.getValorAlvo());
        existente.setValorAtual(meta.getValorAtual());
        existente.setDataInicio(meta.getDataInicio());
        existente.setDataAlvo(meta.getDataAlvo());
        existente.setDescricao(meta.getDescricao());
        existente.setStatus(meta.getStatus());

        Meta atualizada = metaRepository.save(existente);
        return ResponseEntity.ok(atualizada);
    }

    @PatchMapping("/{id}/progresso")
    public ResponseEntity<Meta> atualizarProgresso(
            @PathVariable Long id,
            @RequestParam Double valor,
            Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }

        Meta meta = metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada"));

        // Verificar se a meta pertence ao usuário
        if (!meta.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        meta.setValorAtual(valor);

        // Atualizar status automaticamente se atingiu a meta
        if (valor >= meta.getValorAlvo()) {
            meta.setStatus("CONCLUIDA");
        }

        Meta atualizada = metaRepository.save(meta);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMeta(@PathVariable Long id, Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }

        Meta meta = metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada"));

        // Verificar se a meta pertence ao usuário
        if (!meta.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        metaRepository.delete(meta);
        return ResponseEntity.noContent().build();
    }
}
