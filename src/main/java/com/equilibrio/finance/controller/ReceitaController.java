package com.equilibrio.finance.controller;

import com.equilibrio.finance.model.Receita;
import com.equilibrio.finance.model.User;
import com.equilibrio.finance.repository.ReceitaRepository;
import com.equilibrio.finance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/receitas")
@RequiredArgsConstructor
public class ReceitaController {

    private final ReceitaRepository receitaRepository;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Receita>> listarReceitas(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        List<Receita> receitas = receitaRepository.findByUserIdOrderByDataDesc(user.getId());
        return ResponseEntity.ok(receitas);
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<Receita>> listarReceitasPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim,
            Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        List<Receita> receitas = receitaRepository.findByUserIdAndDataBetweenOrderByDataDesc(
                user.getId(), inicio, fim);
        return ResponseEntity.ok(receitas);
    }

    @PostMapping
    public ResponseEntity<Receita> criarReceita(@RequestBody Receita receita, Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        receita.setUser(user);
        Receita salva = receitaRepository.save(receita);
        return ResponseEntity.ok(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receita> atualizarReceita(
            @PathVariable Long id,
            @RequestBody Receita receita,
            Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }

        Receita existente = receitaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        // Verificar se a receita pertence ao usuário
        if (!existente.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        existente.setDescricao(receita.getDescricao());
        existente.setValor(receita.getValor());
        existente.setCategoria(receita.getCategoria());
        existente.setData(receita.getData());
        existente.setObservacao(receita.getObservacao());

        Receita atualizada = receitaRepository.save(existente);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarReceita(@PathVariable Long id, Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }

        Receita receita = receitaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));

        // Verificar se a receita pertence ao usuário
        if (!receita.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        receitaRepository.delete(receita);
        return ResponseEntity.noContent().build();
    }
}
