package com.equilibrio.finance.config;

import com.equilibrio.finance.model.Role;
import com.equilibrio.finance.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseInitializer {

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepository) {
        return args -> {
            // Criar roles se não existirem
            if (roleRepository.findByName("ROLE_USER").isEmpty()) {
                Role userRole = new Role();
                userRole.setName("ROLE_USER");
                userRole.setDescription("Usuário padrão com acesso gratuito");
                roleRepository.save(userRole);
            }

            if (roleRepository.findByName("ROLE_PREMIUM").isEmpty()) {
                Role premiumRole = new Role();
                premiumRole.setName("ROLE_PREMIUM");
                premiumRole.setDescription("Usuário premium com recursos avançados");
                roleRepository.save(premiumRole);
            }

            if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
                Role adminRole = new Role();
                adminRole.setName("ROLE_ADMIN");
                adminRole.setDescription("Administrador do sistema");
                roleRepository.save(adminRole);
            }
        };
    }
}
