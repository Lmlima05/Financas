package com.equilibrio.finance.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "metas")
public class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private Double valorAlvo;

    @Column(nullable = false)
    private Double valorAtual;

    @Column(nullable = false)
    private LocalDate dataInicio;

    @Column(nullable = false)
    private LocalDate dataAlvo;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false)
    private String status; // EM_PROGRESSO, CONCLUIDA, CANCELADA

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public double getProgresso() {
        if (valorAlvo == 0) {
            return 0;
        }
        return (valorAtual / valorAlvo) * 100;
    }
}
