package com.equilibrio.finance.repository;

import com.equilibrio.finance.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    List<Despesa> findByUserIdOrderByDataDesc(Long userId);

    List<Despesa> findByUserIdAndDataBetweenOrderByDataDesc(Long userId, LocalDate inicio, LocalDate fim);

    List<Despesa> findByUserIdAndCategoria(Long userId, String categoria);
}
