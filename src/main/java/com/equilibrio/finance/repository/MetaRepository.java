package com.equilibrio.finance.repository;

import com.equilibrio.finance.model.Meta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Long> {

    List<Meta> findByUserIdOrderByDataAlvoAsc(Long userId);

    List<Meta> findByUserIdAndStatus(Long userId, String status);
}
