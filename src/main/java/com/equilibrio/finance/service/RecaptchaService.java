package com.equilibrio.finance.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

@Service
public class RecaptchaService {

    private static final Logger logger = LoggerFactory.getLogger(RecaptchaService.class);
    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    @Value("${recaptcha.secret-key}")
    private String secretKey;

    @Value("${recaptcha.enabled:true}")
    private boolean recaptchaEnabled;

    private final RestTemplate restTemplate;

    public RecaptchaService() {
        this.restTemplate = new RestTemplate();
    }

    public boolean verifyRecaptcha(String recaptchaResponse, String remoteIp) {
        // Se o reCAPTCHA estiver desabilitado (para desenvolvimento), retorna true
        if (!recaptchaEnabled) {
            logger.warn("reCAPTCHA está desabilitado. Validação ignorada.");
            return true;
        }

        if (recaptchaResponse == null || recaptchaResponse.isEmpty()) {
            logger.warn("Token reCAPTCHA vazio ou nulo");
            return false;
        }

        try {
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("secret", secretKey);
            params.add("response", recaptchaResponse);
            params.add("remoteip", remoteIp);

            Map<String, Object> response = restTemplate.postForObject(
                    RECAPTCHA_VERIFY_URL,
                    params,
                    Map.class
            );

            if (response != null && response.containsKey("success")) {
                Boolean success = (Boolean) response.get("success");

                if (!success && response.containsKey("error-codes")) {
                    logger.error("Erro na validação do reCAPTCHA: {}", response.get("error-codes"));
                }

                return Boolean.TRUE.equals(success);
            }

            logger.error("Resposta inválida da API do reCAPTCHA");
            return false;

        } catch (Exception e) {
            logger.error("Erro ao verificar reCAPTCHA: {}", e.getMessage(), e);
            // Em caso de erro na verificação, pode-se optar por permitir ou bloquear
            // Para segurança, retornamos false em caso de erro
            return false;
        }
    }
}
