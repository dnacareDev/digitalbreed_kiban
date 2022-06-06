package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Outcome;

public interface SnpService
{
	
	int SelectOutcomeCount(String user_username);
	
	List<Outcome> SelectOutcomeList(String user_username, int offset, int limit);
	
	List<Crop> SelectCrop();

	String SelectMarkerFileName(int marker_id);
	
	Outcome SelectOutcome(int outcome_id);
}