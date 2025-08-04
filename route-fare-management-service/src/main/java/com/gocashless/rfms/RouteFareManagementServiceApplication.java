package com.gocashless.rfms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class RouteFareManagementServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RouteFareManagementServiceApplication.class, args);
	}

}
