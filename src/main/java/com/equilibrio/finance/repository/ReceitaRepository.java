package com.equilibrio.finance.repository;

import com.equilibrio.finance.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    List<Receita> findByUserIdOrderByDataDesc(Long userId);

    List<Receita> findByUserIdAndDataBetweenOrderByDataDesc(Long userId, LocalDate inicio, LocalDate fim);

    List<Receita> findByUserIdAndCategoria(Long userId, String categoria);
}
