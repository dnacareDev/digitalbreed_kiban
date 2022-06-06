package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.Outcome;

public interface SpecificmakerService 
{
	
	int SelectOutcomeCount(String user_username);
	
	List<Outcome> SelectOutcomeList(String user_username, int offset, int limit);

	List<Outcome> SelectOutcomeDetail(int outcome_id);

	List<Marker> SelectMarker(int marker_id);

	Outcome SelectOutcome(int outcome_id);

	// 버전 정보 조회
	List<Marker> SelectMarkerFile(int marker_id);

	List<Crop> SelectCrop();
}