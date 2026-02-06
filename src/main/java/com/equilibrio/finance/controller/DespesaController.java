package com.equilibrio.finance.controller;

import com.equilibrio.finance.model.Despesa;
import com.equilibrio.finance.model.User;
import com.equilibrio.finance.repository.DespesaRepository;
import com.equilibrio.finance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/despesas")
@RequiredArgsConstructor
public class DespesaController {

    private final DespesaRepository despesaRepository;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Despesa>> listarDespesas(Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        List<Despesa> despesas = despesaRepository.findByUserIdOrderByDataDesc(user.getId());
        return ResponseEntity.ok(despesas);
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<Despesa>> listarDespesasPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim,
            Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        List<Despesa> despesas = despesaRepository.findByUserIdAndDataBetweenOrderByDataDesc(
                user.getId(), inicio, fim);
        return ResponseEntity.ok(despesas);
    }

    @PostMapping
    public ResponseEntity<Despesa> criarDespesa(@RequestBody Despesa despesa, Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }
        despesa.setUser(user);
        Despesa salva = despesaRepository.save(despesa);
        return ResponseEntity.ok(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Despesa> atualizarDespesa(
            @PathVariable Long id,
            @RequestBody Despesa despesa,
            Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }

        Despesa existente = despesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));

        // Verificar se a despesa pertence ao usuário
        if (!existente.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        existente.setDescricao(despesa.getDescricao());
        existente.setValor(despesa.getValor());
        existente.setCategoria(despesa.getCategoria());
        existente.setData(despesa.getData());
        existente.setObservacao(despesa.getObservacao());

        Despesa atualizada = despesaRepository.save(existente);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDespesa(@PathVariable Long id, Authentication auth) {
        User user = userService.findByEmail(auth.getName());
        if (user == null) {
            throw new RuntimeException("Usuário não encontrado");
        }

        Despesa despesa = despesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Despesa não encontrada"));

        // Verificar se a despesa pertence ao usuário
        if (!despesa.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        despesaRepository.delete(despesa);
        return ResponseEntity.noContent().build();
    }
}
