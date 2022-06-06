package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Crop;
import kr.or.ih.api.entity.Marker;
import kr.or.ih.api.entity.MarkerFile;
import kr.or.ih.api.entity.Outcome;

public interface MarkerService
{
	// 작물 조회
	List<Crop> SelectCrop();

	// 마커 갯수 조회
	int SelectMarkerCount();

	// 마커 목록 조회
	List<Marker> SelectMarker(int offset, int limit);
	
	// 마커 상세 조회
	Marker SelectMarkerDetail(int marker_id);

	// 마커 파일 조회
	List<MarkerFile> SelectMarkerFile(int marker_id);
	
	int SelectOutcomeCount();
	
	List<Outcome> SelectOutcomeList(int offset, int limit);
	
	// 작물 중복 확인
	int CheckCrop(String new_crop);
	
	// 작물 등록
	int InsertCrop(String new_crop);
	
	// 마커정보 등록
	int InsertMarker(Marker marker);

	// 마커정보 파일 등록
	int InsertMarkerFile(MarkerFile file);
	
	// 마커정보 수정
	int UpdateMarker(Marker marker);

	// 마커 파일 수정
	int UpdateMarkerFile(MarkerFile file);

	// 작물별 버전 조회
	List<Marker> SelectMarkerVersion(String marker_crop);
	
	List<Marker> SelectUseMarkerVersion(String marker_crop);

	// 결과 데이터 등록
	int InsertOutcome(Outcome outcome);

	// 결과 상세 조회
	Outcome SelectOutcomeDetail(int outcome_id);

	// 결과 수정
	int UpdateOutcome(Outcome outcome);

	int UpdateOutcomeResult(int outcome_id, String outcome_result);
}